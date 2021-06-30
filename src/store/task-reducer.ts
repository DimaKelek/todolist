import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";
import {v1} from "uuid";

export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export const todolistID_1 = v1()
export const todolistID_2 = v1()

const initialState: TaskStateType = {
    /*[todolistID_1]: [
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false},
        {id: v1(), title: "Redux", isDone: false}
    ],
    [todolistID_2]: [
        {id: v1(), title: "book", isDone: true},
        {id: v1(), title: "apples", isDone: true},
    ]*/
}

export const tasksReducer = (tasks: TaskStateType = initialState, action: TaskActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...tasks,
                [action.todolistID]: tasks[action.todolistID].filter(t => t.id !== action.taskId)
            }
        case "ADD-TASK":
            let newTask: TaskType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return {...tasks,
                [action.todolistID]: [newTask, ...tasks[action.todolistID]]
            }
        case "CHANGE-STATUS":
            return {
                /*...tasks,
                [action.todolistID]: [
                    ...tasks[action.todolistID].map(t => {
                        if (t.id === action.taskId) {
                            t.isDone = action.isDone
                        }
                        return t
                    })
                ]*/
                ...tasks,
                [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => {
                        if(t.id === action.taskId) {
                            return {...t, isDone: action.isDone}
                        } else {
                            return t
                        }
                    })
            }
        case "CHANGE-TASK-TITLE":
            return {...tasks,
                [action.todolistID]: [
                    ...tasks[action.todolistID].map(t => {
                        if (t.id === action.taskId) {
                            return {...t, title: action.newTitle}
                        } else {
                            return t
                        }
                    })
                ]
            }
        case "REMOVE-TODOLIST":
            const tasksCopy = {...tasks}
            delete (tasksCopy[action.todolistID])
            return tasksCopy
        case "ADD-TODOLIST":
            return {...tasks, [action.todolistID]: []}
        default:
            return tasks
    }
}

export const removeTaskAC = (taskId: string, todolistID: string) => {
    return {type: "REMOVE-TASK", taskId, todolistID} as const
}
export const addTaskAC = (title: string, todolistID: string) => {
    return {type: "ADD-TASK", title, todolistID} as const
}
export const changeStatusAC = (taskId: string, isDone: boolean, todolistID: string) => {
    return {type: "CHANGE-STATUS", taskId, isDone, todolistID} as const
}
export const changeTaskTitleAC = (newTitle: string, taskId: string, todolistID: string) => {
    return {type: "CHANGE-TASK-TITLE", newTitle, taskId, todolistID} as const
}
