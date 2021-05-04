import React, {ChangeEvent, useState} from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: number) => void
    changeFilter: (value: FilterTaskType) => void
    changeStatus: (taskId: number, isDone: boolean) => void
    addTask: (title: string) => void
    filter: FilterTaskType
}

export function Todolist(props: TodolistPropsType) {
    const [title, setTitle] = useState<string>("")

    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id)
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDone = e.currentTarget.checked
            props.changeStatus(t.id, newIsDone)
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
    }

    //---callbacks---//
    const onClickAll = () => props.changeFilter("all");
    const onClickActive = () => props.changeFilter("active");
    const onClickCompleted = () => props.changeFilter("completed");
    const addTask = () => {
        const trimmedTitle = title.trim()
        if(trimmedTitle) {
            props.addTask(trimmedTitle)
        }
        setTitle("")
    }

    return (
        <div className={S.todolist}>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={changeTitle}
                />
                <button onClick={addTask}>+</button>
            </div>
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