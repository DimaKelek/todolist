import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../store/store";
import {addTodolist, getTodolists, TodolistDomainType} from "../../store/todolist-reducer";
import {Grid, Paper} from "@material-ui/core";
import {Todolist} from "./TodoList/Todolist";
import {AddItemForm} from "../Common/AddItemForm/AddItemForm";

export const Todolists: React.FC = React.memo(() => {
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>(state => state.todolists)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTodolists())
    }, [dispatch])

    const onClickAddTodolist = useCallback((title: string) => {
        dispatch(addTodolist(title))
    }, [dispatch])

    const todolistItems = todolists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={10} style={{padding: "20px"}}>
                    <Todolist todolistID={tl.id} title={tl.title} filter={tl.filter}/>
                </Paper>
            </Grid>
        );
    })
    return (
        <>
            <Grid container style={{padding: "20px 0"}}>
                <AddItemForm addItem={onClickAddTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolistItems}
            </Grid>
        </>
    )
})