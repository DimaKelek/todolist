import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../store/store";
import {addTodolist, getTodolists, TodolistDomainType} from "../../store/todolist-reducer";
import {Grid} from "@material-ui/core";
import {Todolist} from "./TodoList/Todolist";
import {AddItemForm} from "../Common/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";

export const Todolists: React.FC = React.memo(() => {
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>(state => state.todolists)
    const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        dispatch(getTodolists())
    }, [dispatch])

    const onClickAddTodolist = useCallback((title: string) => {
        dispatch(addTodolist(title))
    }, [dispatch])

    const todolistItems = todolists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Todolist todolist={tl} entityStatus={tl.entityStatus}/>
            </Grid>
        );
    })

    if(!isLoggedIn) {
        return <Redirect to={"/login"} />
    }
    return (
        <>
            <Grid container style={{padding: "20px 0"}}>
                <AddItemForm placeholder={"Todolist title"} addItem={onClickAddTodolist} />
            </Grid>
            <Grid container spacing={3} >
               {todolistItems}
            </Grid>
        </>
    )
})