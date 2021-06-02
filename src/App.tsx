import React from 'react';
import './App.css';
import {Todolist} from "./Components/Todolist";
import {AddItemForm} from "./Components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";
import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC, TaskStateType} from "./store/task-reducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    FilterTaskType,
    removeTodolistAC,
    TodolistType
} from "./store/todolist-reducer";

function App() {
    const tasks = useSelector<AppStateType, TaskStateType>(state => state.tasks)
    const todolists = useSelector<AppStateType, Array<TodolistType>>(state => state.todolists)
    const dispatch = useDispatch()

    //manipulation of the Tasks
    function addTask(title: string, todolistID: string) {
        dispatch(addTaskAC(title, todolistID))
    }

    function removeTask(taskId: string, todolistID: string) {
        dispatch(removeTaskAC(taskId, todolistID))
    }

    function changeStatus(taskId: string, isDone: boolean, todolistID: string) {
        dispatch(changeStatusAC(taskId, isDone, todolistID))
    }

    function changeTaskTitle(newTitle: string, taskId: string, todolistID: string) {
        dispatch(changeTaskTitleAC(newTitle, taskId, todolistID))
    }

    //manipulation of the todolists
    function removeTodolist(todolistID: string) {
        dispatch(removeTodolistAC(todolistID))
    }

    function addTodolist(title: string) {
        dispatch(addTodolistAC(title))
    }

    function changeTodolistTitle(newTitle: string, todolistID: string) {
       dispatch(changeTodolistTitleAC(newTitle, todolistID))
    }

    function changeFilter(value: FilterTaskType, todolistID: string) {
        dispatch(changeFilterAC(value, todolistID))
    }

    const todolistComponents = todolists.map(tl => {
        let allTodolistTasks = tasks[tl.id];
        let tasksForTodolist = allTodolistTasks;
        if (tl.filter === "active") {
            tasksForTodolist = allTodolistTasks.filter(t => !t.isDone)
        } else if (tl.filter === "completed") {
            tasksForTodolist = allTodolistTasks.filter(t => t.isDone)
        }
        return (
            <Grid item key={tl.id}>
                <Paper elevation={10} style={{padding: "20px"}}>
                    <Todolist
                        todolistID={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        changeStatus={changeStatus}
                        addTask={addTask}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
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
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolistComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
