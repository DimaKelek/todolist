import {addTodolistAC, changeTodolistEntityStatus, removeTodolistAC, setTodolists} from "./todolist-reducer";
import {ServerResponses, taskAPI, TaskStatuses, TaskType} from "../api/api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus, setError} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";

const initialState: TaskStateType = {}

export const tasksReducer = (tasks = initialState, action: TaskActionsType): TaskStateType => {
    switch (action.type) {
        case "TASK/REMOVE-TASK":
            return {...tasks, [action.todolistID]: tasks[action.todolistID]
                    .filter(t => t.id !== action.taskID)}
        case "TASK/ADD-TASK":
            return {...tasks, [action.task.todoListId]: [
                    {...action.task, entityTaskStatus: "idle"}, ...tasks[action.task.todoListId]
                ]}
        case "TASK/CHANGE-STATUS":
            return {...tasks, [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => t.id === action.taskID ? {...t, status: action.status} : t)}
        case "TASK/CHANGE-TASK-TITLE":
            return {...tasks, [action.todolistID]: [...tasks[action.todolistID]
                    .map(t => t.id === action.taskID ? {...t, title: action.newTitle} : t)]}
        case "TODOLIST/REMOVE-TODOLIST":
            let tasksCopy = {...tasks}
            delete (tasksCopy[action.todolistID])
            return tasksCopy
        case "TODOLIST/ADD-TODOLIST":
            return {...tasks, [action.todolist.id]: []}
        case "TODOLIST/SET-TODOLIST": {
            let tasksCopy = {...tasks}
            action.todolists.forEach(tl => tasksCopy[tl.id] = [])
            return tasksCopy
        }
        case "TASK/SET-TASKS":
            return {...tasks, [action.todolistID]: [...action.tasks]
                    .map(t => ({...t, entityTaskStatus: "idle"}))}
        case "TASK/CHANGE-ENTITY-STATUS":
            return {...tasks, [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => t.id === action.taskID ? {...t, entityTaskStatus: action.status} : t)}
        default:
            return tasks
    }
}

// actions
export const removeTaskAC = (taskID: string, todolistID: string) =>
    ({type: "TASK/REMOVE-TASK", taskID, todolistID} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: "TASK/ADD-TASK", task} as const)
export const changeStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) =>
    ({type: "TASK/CHANGE-STATUS", taskID, status, todolistID} as const)
export const changeTaskTitleAC = (newTitle: string, taskID: string, todolistID: string) =>
    ({type: "TASK/CHANGE-TASK-TITLE", newTitle, taskID, todolistID} as const)
export const setTasks = (tasks: TaskType[], todolistID: string) =>
    ({type: "TASK/SET-TASKS", tasks, todolistID} as const)
export const changeTaskEntityStatus = (todolistID: string, taskID: string, status: RequestStatusType) =>
    ({type: "TASK/CHANGE-ENTITY-STATUS", todolistID, taskID, status} as const)

// thunks
export const getTasks = (todolistID: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    taskAPI.getTasks(todolistID)
        .then(response => {
            dispatch(setTasks(response.data.items, todolistID))
            dispatch(setAppStatus("succeeded"))
        })
        .catch(error => {
            dispatch(setError(error.message))
            dispatch(setAppStatus("failed"))
        })
}
export const addTask = (todolistID: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    dispatch(changeTodolistEntityStatus(todolistID, "loading"))
    taskAPI.addTask(todolistID, title)
        .then(response => {
            debugger
            if(response.data.resultCode === ServerResponses.Success) {
                dispatch(addTaskAC(response.data.data.item))
                dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
                dispatch(changeTodolistEntityStatus(todolistID, "failed"))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTodolistEntityStatus(todolistID, "failed"))
        })
}
export const deleteTask = (todolistID: string, taskID: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    dispatch(changeTodolistEntityStatus(todolistID, "loading"))
    dispatch(changeTaskEntityStatus(todolistID, taskID, "loading"))
    taskAPI.removeTask(todolistID, taskID)
        .then(response => {
            if(response.data.resultCode === ServerResponses.Success) {
                dispatch(removeTaskAC(taskID, todolistID))
                dispatch(setAppStatus("succeeded"))
                dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
                dispatch(changeTaskEntityStatus(todolistID, taskID, "succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
                dispatch(changeTodolistEntityStatus(todolistID, "failed"))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTodolistEntityStatus(todolistID, "failed"))
        })
}
export const updateTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses): AppThunk =>
    (dispatch, getState) => {
        dispatch(setAppStatus("loading"))
        dispatch(changeTodolistEntityStatus(todolistID, "loading"))
        dispatch(changeTaskEntityStatus(todolistID, taskID, "loading"))
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
                if(response.data.resultCode === ServerResponses.Success) {
                    dispatch(changeStatusAC(taskID, status, todolistID))
                    dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
                    dispatch(changeTaskEntityStatus(todolistID, taskID, "succeeded"))
                    dispatch(setAppStatus("succeeded"))
                } else {
                    handleServerAppError(response.data, dispatch)
                    dispatch(changeTodolistEntityStatus(todolistID, "failed"))
                }
            }).catch(error => {
                handleServerNetworkError(error, dispatch)
                dispatch(changeTodolistEntityStatus(todolistID, "failed"))
            })
        }
    }
export const updateTaskTitle = (todolistID: string, taskID: string, title: string): AppThunk =>
    (dispatch, getState) => {
        dispatch(setAppStatus("loading"))
        dispatch(changeTodolistEntityStatus(todolistID, "loading"))
        dispatch(changeTaskEntityStatus(todolistID, taskID, "loading"))
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
                if(response.data.resultCode === ServerResponses.Success) {
                    dispatch(changeTaskTitleAC(title, taskID, todolistID))
                    dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
                    dispatch(changeTaskEntityStatus(todolistID, taskID, "succeeded"))
                    dispatch(setAppStatus("succeeded"))
                } else {
                    handleServerAppError(response.data, dispatch)
                    dispatch(changeTodolistEntityStatus(todolistID, "failed"))
                }
            }).catch(error => {
                handleServerNetworkError(error, dispatch)
                dispatch(changeTodolistEntityStatus(todolistID, "failed"))
            })
        }
    }

// types
export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolists>
    | ReturnType<typeof setTasks>
    | ReturnType<typeof setAppStatus>
    | ChangeEntityStatusType

export type ChangeEntityStatusType =
    ReturnType<typeof changeTodolistEntityStatus>
    | ReturnType<typeof changeTaskEntityStatus>

export type TaskDomainType = TaskType & {
    entityTaskStatus: RequestStatusType
}

export type TaskStateType = {[key: string]: Array<TaskDomainType>}