import React from "react";
import S from "./Todolist.module.css"

type TodolistPropsType = {

}

export function Todolist(props: TodolistPropsType) {
    return (
        <div className={S.todolist}>
            <h3>What to learn</h3>
            <div>
                <input />
                <button>+</button>
            </div>
            <ul>
                <li> <input type="checkbox" checked={true}/> <span>HTML</span> </li>
                <li> <input type="checkbox" checked={true}/> <span>CSS</span> </li>
                <li> <input type="checkbox" checked={true}/> <span>JS</span> </li>
                <li> <input type="checkbox" checked={false}/> <span>React</span> </li>
                <li> <input type="checkbox" checked={false}/> <span>Redux</span> </li>
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
}