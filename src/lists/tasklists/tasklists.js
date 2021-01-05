import {CreateTasklist} from "./tasklist/createTasklist";
import {Tasklist} from "./tasklist/tasklist";
import './tasklists.css'
import {Networking} from "../../util";
import styled from "styled-components";
import {getTasklistUrl, TASKLISTS_URL} from "../urls";
import {useMemo} from "react";

const TasklistLists = styled.ul`
  display: flex;
  flex-direction: column;
  height: inherit;
  margin: 0;
  padding: 5px;
`;


export const Tasklists = ({tasklists, listTasklists, currentListId, setAndSaveCurrentList, setDrawerOpen}) => {

    const createTasklist = async (title) => {
        let resp = await Networking.send(TASKLISTS_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({title})
        });
        let json = await resp.json();
        let id = json['id'];
        await listTasklists();
        setAndSaveCurrentList(id);
    };

    const deleteTasklist = id => {
        let decision = window.confirm('Delete tasklist?');
        if (!decision) return;
        Networking.send(getTasklistUrl(id), {
            method: 'DELETE'
        })
            .then(() => listTasklists())
            .then(() => {
                if (currentListId === id) { //If currently selected tasklist is deleted, display first tasklist
                    setAndSaveCurrentList(tasklists[0]['id'])
                }
            });
    };

    let listItems = useMemo(() => [
        <CreateTasklist
            key={0}
            promptCreateTasklist={() => {
                let title = prompt('Enter title:');
                if (title) {
                    createTasklist(title).then(() => setDrawerOpen(false));
                }
            }}
        />,
        tasklists?.map(e =>
            (<Tasklist
                key={e.id}
                id={e.id}
                value={e.title}
                onClick={() => {
                    setDrawerOpen(false);
                    setAndSaveCurrentList(e.id);
                }}
                handleDelete={() => deleteTasklist(e.id)}
            />)
        )

        // eslint-disable-next-line
    ], [tasklists]);

    return <TasklistLists>
        {tasklists
            ? listItems
            : 'Loading...'}
    </TasklistLists>

};