import {ServerResponses, todolistAPI, TodolistType} from "../api/api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = []

export const todolistsSlice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistID: string }>) {
            const index = state.findIndex(t => t.id === action.payload.todolistID)
            state.splice(index, 1)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.push({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ newTitle: string, todolistID: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            state[index].title = action.payload.newTitle
        },
        changeFilterAC(state, action: PayloadAction<{ value: FilterTaskType, todolistID: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            state[index].filter = action.payload.value
        },
        setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            action.payload.todolists.forEach(tl => state.push({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ todolistID: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            state[index].entityStatus = action.payload.status
        }
    }
})

export const {
    removeTodolistAC, addTodolistAC, changeTodolistTitleAC,
    changeFilterAC, setTodolists, changeTodolistEntityStatus
} = todolistsSlice.actions

// thunks
export const getTodolists = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const response = await todolistAPI.getTodolists()
        dispatch(setTodolists({todolists: response.data}))
        dispatch(setAppStatus({status: "succeeded"}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const addTodolist = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const response = await todolistAPI.addTodolist(title)
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(addTodolistAC({todolist: response.data.data.item}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const removeTodolist = (todolistID: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        dispatch(changeTodolistEntityStatus({todolistID, status: "loading"}))
        const response = await todolistAPI.removeTodolist(todolistID)
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(removeTodolistAC({todolistID}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
            dispatch(changeTodolistEntityStatus({todolistID, status: "failed"}))
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTodolistTitle = (todolistID: string, title: string): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const todolist = getState().todolists.find(tl => tl.id === todolistID)
        const response = todolist && await todolistAPI.updateTodolist(todolistID, title)
        if (response) {
            if (response.data.resultCode === ServerResponses.Success) {
                dispatch(changeTodolistTitleAC({newTitle: title, todolistID}))
                dispatch(setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(response.data, dispatch)
            }
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

// types
export type TodolistActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodolists>
    | ReturnType<typeof changeTodolistEntityStatus>
    | ReturnType<typeof setAppStatus>

export type FilterTaskType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterTaskType
    entityStatus: RequestStatusType
}