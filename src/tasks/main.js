import React, {useEffect, useState} from "react";
import {Navbar} from "../components/navbar";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
`;

export const TaskApp = ({returnToMainApp, logout}) => {

    const [currentTasklist, setCurrentTasklist] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);


    const listTasklists = () => {
        Networking.send(TASKLISTS_URL, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(json => setTasklists(json))
        ;
    };

    const getTasklistTitle = id => {
        if (id && tasklists)
            return tasklists.filter(e => e?.id === id)[0]?.title;
        else return 'Tasks'
    };

    useEffect(() => {
        listTasklists()
    }, []);

    return <Container>
        <Navbar
            returnToMainApp={returnToMainApp}
            logout={logout}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            title={getTasklistTitle(currentTasklist)}>
            <Tasklists
                currentTasklist={currentTasklist}
                setCurrentTasklist={setCurrentTasklist}
                returnToMainApp={returnToMainApp}
                setDrawerOpen={setDrawerOpen}
                logout={logout}
                tasklists={tasklists}
                listTasklists={listTasklists}
            />
        </Navbar>
        <Tasks
            currentTasklist={currentTasklist}
        />
    </Container>;
};