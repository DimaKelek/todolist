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
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import {Login} from "../Components/Login/Login";

function App() {
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status)
    return (
        <BrowserRouter>
            <div className="App">
                {status === "failed" && <ErrorSnackbar/>}
                {status === "succeeded" && <ComplitedSnackbar/>}
                <AppBar position={"static"}>
                    <AppMenu/>
                    <div className="progress">{status === "loading" && <LinearProgress/>}</div>
                </AppBar>
                <Container fixed>
                    <Switch>
                        <Route exact path={"/"} render={() => <Todolists/>}/>
                        <Route path={"/login"} render={() => <Login/>}/>
                        <Route path={"/404"} render={() => <h1>404 залупа</h1>}/>
                        <Redirect from={"*"} to={"/404"}/>
                    </Switch>
                </Container>
            </div>
        </BrowserRouter>
    );
}

export default App;