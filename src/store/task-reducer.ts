import {addTodolistAC, changeTodolistEntityStatus, removeTodolistAC, setTodolists} from "./todolist-reducer";
import {ServerResponses, taskAPI, TaskStatuses, TaskType, TodolistType} from "../api/api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskStateType = {}

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskID: string, todolistID: string }>) {
            const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID)
            state[action.payload.todolistID].splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityTaskStatus: "idle"})
        },
        changeStatusAC(state, action: PayloadAction<{ taskID: string, status: TaskStatuses, todolistID: string }>) {
            const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID)
            state[action.payload.todolistID][index].status = action.payload.status
        },
        changeTaskTitleAC(state, action: PayloadAction<{ newTitle: string, taskID: string, todolistID: string }>) {
            const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID)
            state[action.payload.todolistID][index].title = action.payload.newTitle
        },
        setTasks(state, action: PayloadAction<{ tasks: TaskType[], todolistID: string }>) {
            action.payload.tasks.forEach(t => state[action.payload.todolistID].push({...t, entityTaskStatus: "idle"}))
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistID: string, taskID: string, status: RequestStatusType }>) {
            const index = state[action.payload.todolistID].findIndex(t => t.id === action.payload.taskID)
            state[action.payload.todolistID][index].entityTaskStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete (state[action.payload.todolistID])
        })
    }
})

export const {
    removeTaskAC, addTaskAC, setTasks, changeTaskTitleAC,
    changeTaskEntityStatus, changeStatusAC
} = tasksSlice.actions

// thunks
export const getTasks = (todolistID: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const response = await taskAPI.getTasks(todolistID)
        dispatch(setTasks({tasks: response.data.items, todolistID}))
        dispatch(setAppStatus({status: "succeeded"}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const addTask = (todolistID: string, title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        dispatch(changeTodolistEntityStatus({todolistID, status: "loading"}))
        const response = await taskAPI.addTask(todolistID, title)
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(addTaskAC({task: response.data.data.item}))
            dispatch(changeTodolistEntityStatus({todolistID, status: "succeeded"}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
            dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
    }
}
export const deleteTask = (todolistID: string, taskID: string): AppThunk => async dispatch => {
    try {
        debugger
        dispatch(setAppStatus({status: "loading"}))
        dispatch(changeTodolistEntityStatus({todolistID, status: "loading"}))
        dispatch(changeTaskEntityStatus({todolistID, taskID, status: "loading"}))
        const response = await taskAPI.removeTask(todolistID, taskID)
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(removeTaskAC({taskID, todolistID}))
            dispatch(changeTodolistEntityStatus({todolistID, status: "succeeded"}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
            dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
    }
}
export const updateTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setAppStatus({status: "loading"}))
            dispatch(changeTodolistEntityStatus({todolistID, status: "loading"}))
            dispatch(changeTaskEntityStatus({todolistID, taskID, status: "loading"}))
            const task = getState().tasks[todolistID].find(t => t.id === taskID)
            if (task) {
                const response = await taskAPI.updateTask(todolistID, taskID, {
                    title: task.title,
                    status,
                    description: task.description,
                    deadline: task.deadline,
                    startDate: task.startDate,
                    priority: task.priority
                })
                if (response.data.resultCode === ServerResponses.Success) {
                    dispatch(changeStatusAC({taskID, status, todolistID}))
                    dispatch(changeTodolistEntityStatus({todolistID, status: "succeeded"}))
                    dispatch(changeTaskEntityStatus({todolistID, taskID, status: "succeeded"}))
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(response.data, dispatch)
                    dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
                }
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
        }
    }
export const updateTaskTitle = (todolistID: string, taskID: string, newTitle: string): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setAppStatus({status: "loading"}))
            dispatch(changeTodolistEntityStatus({todolistID, status: "loading"}))
            dispatch(changeTaskEntityStatus({todolistID, taskID, status: "loading"}))
            const task = getState().tasks[todolistID].find(t => t.id === taskID)
            if (task) {
                const response = await taskAPI.updateTask(todolistID, taskID, {
                    title: newTitle,
                    status: task.status,
                    description: task.description,
                    deadline: task.deadline,
                    startDate: task.startDate,
                    priority: task.priority
                })
                if (response.data.resultCode === ServerResponses.Success) {
                    dispatch(changeTaskTitleAC({newTitle, taskID, todolistID}))
                    dispatch(changeTodolistEntityStatus({todolistID, status: "succeeded"}))
                    dispatch(changeTaskEntityStatus({todolistID, taskID, status: "succeeded"}))
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    handleServerAppError(response.data, dispatch)
                    dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
                }
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
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

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}