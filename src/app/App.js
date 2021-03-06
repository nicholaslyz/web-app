import { Loader } from '@react-three/drei';
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Hmail } from "../modules/Hmail/Hmail";
import { AppBar } from "./app-bar/AppBar";
import { selectLoginStatus } from "./appSlice";
import { Login } from "./auth/Login";
import { RefreshSession } from "./refresh-session/RefreshSession";
import { Starfield } from "./starfield/Starfield";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const { loggedIn, isSuperUser } = useSelector(selectLoginStatus)

    return loggedIn ?
        <>
            {isSuperUser && <Hmail />}
            <RefreshSession />
            <AppBar />
        </> :
        <>
        <Suspense fallback={null}>
            <Starfield />
            <Login />
        </Suspense>
        <Loader/>
        </>;
};
