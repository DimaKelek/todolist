import React, {useEffect} from 'react';
import './App.css';
import {AppBar, CircularProgress, Container, LinearProgress} from "@material-ui/core";
import {AppMenu} from "./AppMenu";
import {Todolists} from "../Components/Todolists/Todolists";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../store/store";
import {authMe, RequestStatusType} from "../store/app-reducer";
import {ErrorSnackbar} from "../Components/Common/ErrorSnackbar/ErrorSnackbar";
import {ComplitedSnackbar} from "../Components/Common/ComplitedSnackbar/ComplitedSnackbar";
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import {Login} from "../Components/Login/Login";

function App() {
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(authMe())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            {status === "failed" && <ErrorSnackbar/>}
            {status === "succeeded" && <ComplitedSnackbar/>}
            <AppBar position={"static"}>
                <AppMenu isLoggedIn={isLoggedIn}/>
                <div className="progress">{status === "loading" && <LinearProgress/>}</div>
            </AppBar>
            <Container fixed>
                <BrowserRouter>
                    <Switch>
                        <Route exact path={"/"} render={() => <Todolists/>}/>
                        <Route path={"/login"} render={() => <Login/>}/>
                        <Route path={"/404"} render={() => <h1>404 залупа</h1>}/>
                        <Redirect from={"*"} to={"/404"}/>
                    </Switch>
                </BrowserRouter>
            </Container>
        </div>
    );
}

export default App;