import { createSlice, isAllOf, isRejectedWithValue } from "@reduxjs/toolkit";
import { NETWORK_ERROR, NETWORK_METHOD } from "./constants";
import { authApi } from "./auth/authApi";

export const appSliceName = 'app'

const initialState = {
    /*Current module to display
    * Title and other cosmetic effects are managed by components themselves*/
    module: {
        id: null,
        meta: {}
    },

    loginStatus: {
        user: null,
        expiry: null,
        isSuperUser: false,
        recaptchaKey: null,
        loggedIn: false,
    },
    networkError: null,
    pendingNetworkActions: []
}

export const send = () => {
}

/**
 * Convenience methods for obtaining get, add, update and delete methods from a URL
 * These must be dispatched with
 *
 * <pre>
 * get: function(...params) => url(...params)
 * add: function(object, ...params) => url(...params)
 * update: function (object, id, ...params) => detailUrl(id, ...params)
 * del: function (id, ...params) => detailUrl(id, ...params)
 * </pre>
 *
 * @param url str or function(...params) => url to obtain object list
 * @param detailUrl function(id, ...params) => url to obtain object details
 * @returns {[function(): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>]}
 */
export const crudMethods = (url, detailUrl) => {
    let get = (...params) => send(
        typeof url === 'function' ?
            url(...params) :
            url,
        { method: NETWORK_METHOD.GET });

    let add = (object, ...params) => send(
        typeof url === 'function' ?
            url(...params) :
            url,
        {
            method: NETWORK_METHOD.POST,
            body: JSON.stringify(object),
        });

    let update = (object, id, ...params) => send(
        detailUrl(id, ...params),
        {
            method: NETWORK_METHOD.PUT,
            body: JSON.stringify(object),
        });

    let del = (id, ...params) => send(
        detailUrl(id, ...params),
        { method: NETWORK_METHOD.DELETE }); //Note - for a DELETE operation, nothing is returned by the server

    return [get, add, update, del]
}

const handleLoginFulfilled = (state, {
    payload: {
        user,
        expiry,
        is_superuser: isSuperUser,
        recaptcha_key: recaptchaKey
    }

}) => void (state.loginStatus = {
    user,
    expiry,
    isSuperUser,
    recaptchaKey,
    loggedIn: true,
})

const setNetworkErrorReducer = (state, action) => {

    let payload = action.payload
    let {
        method = 'Method not specified',
        url = 'URL not specified',
        text = '',
        status = null, /*Must be specified if HTTP_ERROR*/
        type
    } = payload

    /*Type not specified:  rejected thunk with value which is NOT a NetworkError object*/
    if (!type) {
        state.networkError = {
            method,
            url,
            text: JSON.stringify(action, undefined, 2),
            status,
            type
        }
        return
    }

    if (type === NETWORK_ERROR.HTTP_ERROR && typeof status !== 'number')
        throw new Error(`NetworkError: 'status' must be a number if 
            'type' === HTTP_ERROR, but got ${status} instead`)

    /*Ignore 401/403 errors if not logged in*/
    if (!state.loginStatus.loggedIn &&
        [401, 403].includes(status)) {
        return
    }
    state.networkError = { method, url, text, status, type }
}

export const appSlice = createSlice({
    name: appSliceName,
    initialState,
    reducers: {
        setNetworkError: setNetworkErrorReducer,
        clearNetworkError: state => void (state.networkError = null),
        setCurrentModule: (state, { payload: { id = null, meta = {} } = {} }) => void (state.module = { id, meta }),
        setAppBar: (state, { payload: { drawerOpen = false } }) => void (state.appBar.drawerOpen = drawerOpen),
        addNetworkAction: (state, { payload }) => {
            if (!state.pendingNetworkActions.includes(payload))
                state.pendingNetworkActions.push(payload)
        },
        removeNetworkAction: (state, { payload }) => {
            if (state.pendingNetworkActions.includes(payload))
                state.pendingNetworkActions.splice(state.pendingNetworkActions.indexOf(payload), 1)
        },
    },
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.checkLogin.matchFulfilled, handleLoginFulfilled)
        .addMatcher(isAllOf(authApi.endpoints.checkLogin.matchRejected, isRejectedWithValue),
            (state, action) => {
                let payload = action.payload
                if (payload.type === NETWORK_ERROR.HTTP_ERROR && [401, 403].includes(payload.status))
                    state.loginStatus.recaptchaKey = payload.data.recaptcha_key
            })
        .addMatcher(authApi.endpoints.login.matchFulfilled, handleLoginFulfilled)
        .addMatcher(authApi.endpoints.logout.matchFulfilled, () => {
            /*Not pure, but an exception here as I want to clear everything*/
            localStorage.clear()
            /*Page is refreshed on logout, to clear both Redux store and cached memory.*/
            window.location.reload()
        })

})

export const {
    setNetworkError,
    clearNetworkError,
    setCurrentModule,
    setAppBar,
    addNetworkAction,
    removeNetworkAction
} = appSlice.actions

export const selectLoginStatus = state => state[appSliceName].loginStatus
export const selectNetworkError = state => state[appSliceName].networkError
export const selectCurrentModule = state => state[appSliceName].module
export const selectPendingNetworkActions = state => state[appSliceName].pendingNetworkActions