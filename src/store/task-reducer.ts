import {TaskStateType, TaskType} from "../App";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";

export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>

export const tasksReducer = (tasks: TaskStateType, action: TaskActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...tasks,
                [action.todolistID]: [
                    ...tasks[action.todolistID].filter(t => t.id !== action.taskId)
                ]
            }
        case "ADD-TASK":
            let newTask: TaskType = {
                id: action.todolistID,
                title: action.title,
                isDone: false
            }
            return {
                ...tasks,
                [action.todolistID]: [newTask, ...tasks[action.todolistID]]
            }
        case "CHANGE-STATUS":
            return {
                ...tasks,
                [action.todolistID]: [
                    ...tasks[action.todolistID].map(t => {
                        if(t.id === action.taskId) {
                            t.isDone = action.isDone
                        }
                        return t
                    })
                ]
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...tasks,
                [action.todolistID]: [
                    ...tasks[action.todolistID].map(t => {
                        if(t.id === action.taskId) {
                            t.title = action.newTitle
                        }
                        return t
                    })
                ]
            }
        case "REMOVE-TODOLIST":
            const tasksCopy = {...tasks}
            delete (tasksCopy[action.todolistID])
            return tasksCopy
        case "ADD-TODOLIST":
            return {
                [action.todolistID]: []
            }
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
