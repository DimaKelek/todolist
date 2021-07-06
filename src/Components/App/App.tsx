import React from 'react';
import './App.css';
import {AppBar, Container} from "@material-ui/core";
import {AppMenu} from "./AppMenu";
import {Todolists} from "../Todolists/Todolists";

function App() {
    return (
        <div className="App">
            <AppBar position={"static"}>
                <AppMenu />
            </AppBar>
            <Container fixed>
                <Todolists />
            </Container>
        </div>
    );
}

export default App;