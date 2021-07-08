import React from 'react';
import './App.css';
import {AppBar, Container, LinearProgress} from "@material-ui/core";
import {AppMenu} from "./AppMenu";
import {Todolists} from "../Components/Todolists/Todolists";
import {useSelector} from "react-redux";
import {AppStateType} from "../store/store";
import {RequestStatusType} from "../store/app-reducer";
import {ErrorSnackbar} from "../Components/Common/ErrorSnackbar/ErrorSnackbar";
import {ComplitedSnackbar} from "../Components/Common/ComplitedSnackbar/ComplitedSnackbar";

function App() {
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status)
    return (
        <div className="App">
            {status === "failed" && <ErrorSnackbar/>}
            {status === "succeeded" && <ComplitedSnackbar/>}
            <AppBar position={"static"}>
                <AppMenu />
                <div className="progress">{status === "loading" && <LinearProgress/>}</div>
            </AppBar>
            <Container fixed>
                <Todolists />
            </Container>
        </div>
    );
}

export default App;