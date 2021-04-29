import React, {ChangeEvent} from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: number) => void
    changeFilter: (value: FilterTaskType) => void
    changeStatus: (taskId: number, isDone: boolean) => void
}

export function Todolist(props: TodolistPropsType) {

    const tasks = props.tasks.map(t => {
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDone = e.currentTarget.checked
            props.changeStatus(t.id, newIsDone)
        }
        return (
            <li key={t.id}>
                <input type="checkbox" onChange={changeStatus} checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={() => {props.removeTask(t.id)}}>X</button>
            </li>
        );
    })

    const onClickAll = () => props.changeFilter("all");
    const onClickActive = () => props.changeFilter("active");
    const onClickCompleted = () => props.changeFilter("completed");
    return (
        <div className={S.todolist}>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>{tasks}</ul>
            <div>
                <button onClick={onClickAll}>All</button>
                <button onClick={onClickActive}>Active</button>
                <button onClick={onClickCompleted}>Completed</button>
            </div>
        </div>
    );
}