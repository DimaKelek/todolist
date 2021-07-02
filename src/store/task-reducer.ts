import {addTodolistAC, removeTodolistAC, setTodolists} from "./todolist-reducer";
import {v1} from "uuid";
import {taskAPI, TaskPriorities, TaskStatuses, TaskType} from "../api/api";
import {Dispatch} from "react";
import {AppStateType} from "./store";

export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolists>
    | ReturnType<typeof setTasks>


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
            return {...tasks, [action.task.todoListId]: [action.task, ...tasks[action.task.todoListId]]}
        case "CHANGE-STATUS":
            return {
                ...tasks,
                [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => {
                        if(t.id === action.taskId) {
                            return {...t, status: action.status}
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
            let tasksCopy = {...tasks}
            delete (tasksCopy[action.todolistID])
            return tasksCopy
        case "ADD-TODOLIST":
            return {...tasks, [action.todolistID]: []}
        case "SET-TODOLIST": {
            let tasksCopy = {...tasks}
            action.todolists.forEach(tl => {
                tasksCopy[tl.id] = []
            })
            return tasksCopy
        }
        case "SET-TASKS":
            return {...tasks, [action.todolistID]: [...action.tasks]}
        default:
            return tasks
    }
}

export const removeTaskAC = (taskId: string, todolistID: string) => {
    return {type: "REMOVE-TASK", taskId, todolistID} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", task} as const
}
export const changeStatusAC = (taskId: string, status: TaskStatuses, todolistID: string) => {
    return {type: "CHANGE-STATUS", taskId, status, todolistID} as const
}
export const changeTaskTitleAC = (newTitle: string, taskId: string, todolistID: string) => {
    return {type: "CHANGE-TASK-TITLE", newTitle, taskId, todolistID} as const
}

////////////////////

export const setTasks = (tasks: TaskType[], todolistID: string) => {
    return {type: "SET-TASKS", tasks, todolistID} as const
}

///////////////////

export const getTasks = (todolistID: string) => {
    return (dispatch: Dispatch<any>) => {
        taskAPI.getTasks(todolistID)
            .then(response => {
                dispatch(setTasks(response.data.items, todolistID))
            })
    }
}

export const addTask = (todolistID: string, title: string) => {
    return (dispatch: Dispatch<any>) => {
        taskAPI.addTask(todolistID, title)
            .then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(addTaskAC(response.data.data.item))
                }
            })
    }
}

export const updateTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<any>, getState: () => AppStateType) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID)
        if(task) {
            taskAPI.updateTask(todolistID, taskID, {
                title: task.title,
                status,
                description: task.description,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority
            }).then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(changeStatusAC(taskID, status, todolistID))
                }
            })
        }
    }
}

export const updateTaskTitle = (todolistID: string, taskID: string, title: string) => {
    return (dispatch: Dispatch<any>, getState: () => AppStateType) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID)
        if(task) {
            taskAPI.updateTask(todolistID, taskID, {
                title,
                status: task.status,
                description: task.description,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority
            }).then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(changeTaskTitleAC(title, taskID, todolistID))
                }
            })
        }
    }
}

export const deleteTask = (todolistID: string, taskID: string) => {
    return (dispatch: Dispatch<any>) => {
        taskAPI.removeTask(todolistID, taskID)
            .then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskID, todolistID))
                }
            })
    }
}