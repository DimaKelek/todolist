import React, {ChangeEvent, useState} from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";

type TodolistPropsType = {
    todolistID: string
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todolistID: string) => void
    changeFilter: (value: FilterTaskType) => void
    changeStatus: (taskId: string, isDone: boolean, todolistID: string) => void
    addTask: (title: string, todolistID: string) => void
    filter: FilterTaskType
    removeTodolist: (todolistID: string) => void
}

export function Todolist(props: TodolistPropsType) {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean | null>(false)

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
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    //---callbacks---//
    const onClickAll = () => props.changeFilter("all");
    const onClickActive = () => props.changeFilter("active");
    const onClickCompleted = () => props.changeFilter("completed");
    const addTask = () => {
        const trimmedTitle = title.trim()
        if(trimmedTitle) {
            props.addTask(trimmedTitle, props.todolistID)
            setError(false)
        } else {
            setError(true)
        }
        setTitle("")
    }
    const deleteTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const errorMessage = error ? <div className="error-message">Title is required!!!</div> : null

    return (
        <div className={S.todolist}>
            <h3>{props.title}<button onClick={deleteTodolist}>x</button></h3>
            <div>
                <input
                    className={error ? "error-input" : ""}
                    value={title}
                    onChange={changeTitle}
                />
                <button onClick={addTask}>+</button>
            </div>
            {errorMessage}
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