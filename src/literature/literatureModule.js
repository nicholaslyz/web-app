import { useState } from 'react';
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";
import {Networking} from "../util";
import * as Url from "./urls";
import {Paper, Tab, Tabs, Typography} from "@material-ui/core";
import {AppBarResponsive} from "../components/appBarResponsive";

const LIT_APP_SECTIONS = {
    addBooks: 'addBooks',
    viewBooks: 'viewBooks'
};

export const LiteratureModule = ({returnToMainApp, logout, ...props}) => {
    const [books, setBooks] = useState([]);
    const [tabValue, setTabValue] = useState(LIT_APP_SECTIONS.addBooks);
    const [drawerOpen, setDrawerOpen] = useState(false);


    const refreshBooks = () => {
        Networking.send(Url.BOOKS, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => setBooks(json));
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    let currentApp;

    switch (tabValue) {
        case LIT_APP_SECTIONS.addBooks:
            currentApp = <AddBooks refreshBooks={refreshBooks}/>;
            break;
        case LIT_APP_SECTIONS.viewBooks:
            currentApp = <ViewBooks books={books} refreshBooks={refreshBooks}/>;
            break;
        default:
            currentApp = 'Select a tab'
    }

    return <AppBarResponsive
        appName={'Literature'}
        titleContent={<Typography variant={"h6"} noWrap>Literature</Typography>}
        logout={logout}
        returnToMainApp={returnToMainApp}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}>

        <Paper>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                indicatorColor={'primary'}
                textColor={'primary'}>
                <Tab label={'Add Books'} value={LIT_APP_SECTIONS.addBooks}/>
                <Tab label={'Book List'} value={LIT_APP_SECTIONS.viewBooks}/>
            </Tabs>
        </Paper>
        {currentApp}
    </AppBarResponsive>;
};