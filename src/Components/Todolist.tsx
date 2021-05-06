import React, {ChangeEvent} from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";
import {AddItemForm} from "./AddItemForm/AddItemForm";

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
}

export function Todolist(props: TodolistPropsType) {

    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id, props.todolistID)
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDone = e.currentTarget.checked
            props.changeStatus(t.id, newIsDone, props.todolistID)
        }
        return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                <input type="checkbox" onChange={changeStatus} checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={removeTask}>X</button>
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

    return (
        <div className={S.todolist}>
            <h3>{props.title}<button onClick={deleteTodolist}>x</button></h3>
            <AddItemForm addItem={addItem} />
            <ul>{tasks}</ul>
            <div>
                <button
                    onClick={onClickAll}
                    className={props.filter === "all" ? "active-filter" : ""}
                >All</button>
                <button
                    onClick={onClickActive}
                    className={props.filter === "active" ? "active-filter" : ""}
                >Active</button>
                <button
                    onClick={onClickCompleted}
                    className={props.filter === "completed" ? "active-filter" : ""}
                >Completed</button>
            </div>
        </div>
    );
}