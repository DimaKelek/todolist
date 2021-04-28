import React from "react";
import S from "./Todolist.module.css"
import {TaskType} from "../App";

type TodolistPropsType = {
    title: string
    tasks: TaskType[]
}

export function Todolist(props: TodolistPropsType) {
    const tasks = props.tasks.map( t => <li key={t.id}>
        <input
            type="checkbox"
            checked={t.isDone}
        />
        <span>{t.title}</span> </li>
    )
    return (
        <div className={S.todolist}>
            <h3>{props.title}</h3>
            <div>
                <input />
                <button>+</button>
            </div>
            <ul>
                {tasks}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
}