import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/api";

export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>


export type TaskStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TaskStateType = {}

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
                addedDate: new Date().toDateString(),
                completed: false,
                deadline: "",
                description: "",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: new Date().toDateString(),
                status: TaskStatuses.New,
                todoListId: action.todolistID
            }
            return {...tasks,
                [action.todolistID]: [newTask, ...tasks[action.todolistID]]
            }
        case "CHANGE-STATUS":
            return {
                ...tasks,
                [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => {
                        if(t.id === action.taskId) {
                            return {...t, completed: action.completed}
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
export const changeStatusAC = (taskId: string, completed: boolean, todolistID: string) => {
    return {type: "CHANGE-STATUS", taskId, completed, todolistID} as const
}
export const changeTaskTitleAC = (newTitle: string, taskId: string, todolistID: string) => {
    return {type: "CHANGE-TASK-TITLE", newTitle, taskId, todolistID} as const
}
