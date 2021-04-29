import React from "react";
import S from "./Todolist.module.css"
import {FilterTaskType, TaskType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: number) => void
    changeFilter: (filter: FilterTaskType) => void
}

export function Todolist(props: TodolistPropsType) {

    const tasks = props.tasks.map( t => <li key={t.id}>
        <input
            type="checkbox"
            checked={t.isDone}
        />
        <span>{t.title}</span>
        <button onClick={() => {props.removeTask(t.id)}}>X</button> </li>
    )
    const onclickAll = () => props.changeFilter("all");
    const onclickActive = () => props.changeFilter("active");
    const onclickCompleted = () => props.changeFilter("completed");
    return (
        <div className={S.todolist}>
            <h3>{props.title}</h3>
            <div>
                <input />
                <button>+</button>
            </div>
            <ul>{tasks}</ul>
            <div>
                <button onClick={onclickAll}>All</button>
                <button onClick={onclickActive}>Active</button>
                <button onClick={onclickCompleted}>Completed</button>
            </div>
        </div>
    );
}