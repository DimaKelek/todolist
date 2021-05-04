import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Components/Todolist";
import {v1} from "uuid";

export type FilterTaskType = "all" | "active" | "completed"

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistType = {
    id: string
    title: string
    filter: FilterTaskType
}
type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const todolistID_1 = v1()
    const todolistID_2 = v1()
    const [filter, setFilter] = useState<FilterTaskType>("all")

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistID_1, title: "What to learn", filter: "all"},
        {id: todolistID_2, title: "What to buy", filter: "all"}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
        [todolistID_1]:[
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false}
        ],
        [todolistID_2]:[
            {id: v1(), title: "book", isDone: true},
            {id: v1(), title: "apples", isDone: true},
        ]
    })
    //manipulation of the Turks
    function addTask(title: string, todolistID: string) {
        let newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false
        }
        setTasks({...tasks, [todolistID]:[newTask, ...tasks[todolistID]]})
    }
    function removeTask(taskId: string, todolistID: string) {
        tasks[todolistID] = tasks[todolistID].filter( t => t.id !== taskId)
        setTasks({...tasks})
    }
    function changeFilter(value: FilterTaskType) {
        setFilter(value)
    }
    function changeStatus(taskId: string, isDone: boolean, todolistID: string) {
        let task = tasks[todolistID].find( t => t.id === taskId)
        if(task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }

    //manipulation of the todolists
    function removeTodolist(todolistID: string) {
        setTodolists(todolists.filter(tl => tl.id !== todolistID))
        delete(tasks[todolistID])
    }
    const todolistComponents = todolists.map( tl => {
        let filteredTasks = tasks[tl.id]
        if (filter === "active") {
            filteredTasks = tasks[tl.id].filter(t => t.isDone === false)
        } else if (filter === "completed") {
            filteredTasks = tasks[tl.id].filter(t => t.isDone === true)
        }
        return (
            <Todolist
                key={tl.id}
                todolistID={tl.id}
                title={"What to learn"}
                tasks={filteredTasks}
                removeTask={removeTask}
                changeFilter={changeFilter}
                changeStatus={changeStatus}
                addTask={addTask}
                filter={filter}
                removeTodolist={removeTodolist}
            />
        );
    })
    return (
        <div className="App">
            {todolistComponents}
        </div>
    );
}

export default App;
