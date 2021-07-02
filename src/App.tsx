import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./Components/Todolist/Todolist";
import {AddItemForm} from "./Components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";
import {addTodolist, getTodolists, TodolistDomainType} from "./store/todolist-reducer";

function App() {
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>(state => state.todolists)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTodolists())
    }, [dispatch])

    const onClickAddTodolist = useCallback((title: string) => {
        dispatch(addTodolist(title))
    }, [dispatch])

    const todolistComponents = todolists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={10} style={{padding: "20px"}}>
                    <Todolist todolistID={tl.id} title={tl.title} filter={tl.filter}/>
                </Paper>
            </Grid>
        );
    })
    return (
        <div className="App">
            <AppBar position={"static"}>
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton color={"inherit"}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        Todolists
                    </Typography>
                    <Button color={"inherit"} variant={"outlined"}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0"}}>
                    <AddItemForm addItem={onClickAddTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolistComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default App;