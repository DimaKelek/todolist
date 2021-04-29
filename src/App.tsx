import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Components/Todolist";

export type FilterTaskType = "all" | "active" | "completed"

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

function App() {
    const [filter, setFilter] = useState<FilterTaskType>("all")

    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS", isDone: true},
        {id: 4, title: "React", isDone: false},
        {id: 5, title: "Redux", isDone: false}
    ])

    function removeTask(taskId: number) {
        let filteredTasks = tasks.filter( t => t.id !== taskId)
        setTasks(filteredTasks)
    }

    function changeFilter(value: FilterTaskType) {
        setFilter(value)
    }

    function changeStatus(taskId: number, isDone: boolean) {
        let task = tasks.find( t => t.id === taskId)
        if(task) {
            task.isDone = isDone
            setTasks([...tasks])
        }
    }

    let filteredTasks = tasks
    if (filter === "active") {
        filteredTasks = tasks.filter(t => t.isDone === false)
    } else if (filter === "completed") {
        filteredTasks = tasks.filter(t => t.isDone === true)
    }

    return (
        <div className="App">
            <Todolist
                title={"What to learn"}
                tasks={filteredTasks}
                removeTask={removeTask}
                changeFilter={changeFilter}
                changeStatus={changeStatus}
            />
        </div>
    );
}

export default App;
