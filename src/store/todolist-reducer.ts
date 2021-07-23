import {ServerResponses, todolistAPI, TodolistType} from "../api/api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (todolists = initialState, action: TodolistActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "TODOLIST/REMOVE-TODOLIST": {
            return todolists.filter(tl => tl.id !== action.todolistID)
        }
        case "TODOLIST/ADD-TODOLIST": {
            return [...todolists, {...action.todolist, filter: "all", entityStatus: "idle"}]
        }
        case "TODOLIST/CHANGE-TODOLIST-TITLE": {
            let copyTodolists = [...todolists]
            let todolist = copyTodolists.find(tl => tl.id === action.todolistID)
            todolist && (todolist.title = action.newTitle)
            return copyTodolists
        }
        case "TODOLIST/CHANGE-FILTER": {
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        }
        case "TODOLIST/SET-TODOLIST": {
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        }
        case "TODOLIST/SET-TODOLIST-STATUS": {
            let copyTodolists = [...todolists]
            let todolist = copyTodolists.find(tl => tl.id === action.todolistID)
            todolist && (todolist.entityStatus = action.status)
            return copyTodolists
        }
        default:
            return todolists
    }
}

// actions
export const removeTodolistAC = (todolistID: string) =>
    ({type: "TODOLIST/REMOVE-TODOLIST", todolistID} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: "TODOLIST/ADD-TODOLIST", todolist} as const)
export const changeTodolistTitleAC = (newTitle: string, todolistID: string) =>
    ({type: "TODOLIST/CHANGE-TODOLIST-TITLE", newTitle, todolistID} as const)
export const changeFilterAC = (value: FilterTaskType, todolistID: string) =>
    ({type: "TODOLIST/CHANGE-FILTER", value, todolistID} as const)
export const setTodolists = (todolists: TodolistType[]) =>
    ({type: "TODOLIST/SET-TODOLIST", todolists} as const)
export const changeTodolistEntityStatus = (todolistID: string, status: RequestStatusType) =>
    ({type: "TODOLIST/SET-TODOLIST-STATUS", todolistID, status} as const)

// thunks
export const getTodolists = (): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    todolistAPI.getTodolists()
        .then(response => {
            dispatch(setTodolists(response.data))
            dispatch(setAppStatus("succeeded"))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const addTodolist = (title: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    todolistAPI.addTodolist(title)
        .then(response => {
            if(response.data.resultCode === ServerResponses.Success) {
                dispatch(addTodolistAC(response.data.data.item))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTodolist = (todolistID: string): AppThunk => dispatch => {
    dispatch(setAppStatus("loading"))
    dispatch(changeTodolistEntityStatus(todolistID, "loading"))
    todolistAPI.removeTodolist(todolistID)
        .then(response => {
            if(response.data.resultCode === ServerResponses.Success) {
                dispatch(removeTodolistAC(todolistID))
                dispatch(setAppStatus("succeeded"))
                dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
                dispatch(changeTodolistEntityStatus(todolistID, "failed"))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTodolistTitle = (todolistID: string, title: string): AppThunk =>
    (dispatch, getState) => {
        dispatch(setAppStatus("loading"))
        const todolist = getState().todolists.find(tl => tl.id === todolistID)
        todolist && todolistAPI.updateTodolist(todolistID, title)
            .then(response => {
                if(response.data.resultCode === ServerResponses.Success) {
                    dispatch(changeTodolistTitleAC(title, todolistID))
                    dispatch(setAppStatus("succeeded"))
                } else {
                    handleServerAppError(response.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
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