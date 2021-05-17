import React, {ChangeEvent} from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type TodolistPropsType = {
    todolistID: string
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todolistID: string) => void
    changeFilter: (value: FilterTaskType, todolistID: string) => void
    changeStatus: (taskId: string, isDone: boolean, todolistID: string) => void
    addTask: (title: string, todolistID: string) => void
    filter: FilterTaskType
    removeTodolist: (todolistID: string) => void
    changeTaskTitle: (newTitle: string, taskId: string, todolistID: string) => void
    changeTodolistTitle: (newTitle: string, todolistID: string) => void
}

export function Todolist(props: TodolistPropsType) {

    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id, props.todolistID)
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDone = e.currentTarget.checked
            props.changeStatus(t.id, newIsDone, props.todolistID)
        }
        const changeTitle = (newTitle: string) => {
            props.changeTaskTitle(newTitle, t.id, props.todolistID)
        }

        return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                <Checkbox color={"primary"} onChange={changeStatus} checked={t.isDone}/>
                <EditableSpan title={t.title} onChangeTitle={changeTitle}/>
                <IconButton onClick={removeTask}>
                    <Delete color={"primary"}/>
                </IconButton>
            </li>
        );
    })

    //---callbacks---//
    const onClickAll = () => props.changeFilter("all", props.todolistID);
    const onClickActive = () => props.changeFilter("active", props.todolistID);
    const onClickCompleted = () => props.changeFilter("completed", props.todolistID);
    const deleteTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const addItem = (title: string) => props.addTask(title, props.todolistID)
    const changeTodolistTitle = (newTitle: string) => {
        props.changeTodolistTitle(newTitle, props.todolistID)
    }
    return (
        <div className={S.todolist}>
            <h3>
                <EditableSpan title={props.title} onChangeTitle={changeTodolistTitle}/>
                <IconButton onClick={deleteTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addItem}/>
            <ul>{tasks}</ul>
            <div>
                <Button
                    onClick={onClickAll}
                    variant={props.filter === "all" ? "contained" : "text"}
                    color={"primary"}
                >All</Button>
                <Button
                    onClick={onClickActive}
                    variant={props.filter === "active" ? "contained" : "text"}
                    color={"primary"}
                >Active</Button>
                <Button
                    onClick={onClickCompleted}
                    variant={props.filter === "completed" ? "contained" : "text"}
                    color={"primary"}
                >Completed</Button>
            </div>
        </div>
    );
}