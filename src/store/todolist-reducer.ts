import {todolistAPI, TodolistType} from "../api/api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatus, setError} from "./app-reducer";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (todolists = initialState, action: TodolistActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return todolists.filter(tl => tl.id !== action.todolistID)
        }
        case "ADD-TODOLIST": {
            return [...todolists, {...action.todolist, filter: "all", entityStatus: "idle"}]
        }
        case "CHANGE-TODOLIST-TITLE": {
            let copyTodolists = [...todolists]
            let todolist = copyTodolists.find(tl => tl.id === action.todolistID)
            todolist && (todolist.title = action.newTitle)
            return copyTodolists
        }
        case "CHANGE-FILTER": {
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        }
        case "SET-TODOLIST": {
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
    ({type: "REMOVE-TODOLIST", todolistID} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: "ADD-TODOLIST", todolist} as const)
export const changeTodolistTitleAC = (newTitle: string, todolistID: string) =>
    ({type: "CHANGE-TODOLIST-TITLE", newTitle, todolistID} as const)
export const changeFilterAC = (value: FilterTaskType, todolistID: string) =>
    ({type: "CHANGE-FILTER", value, todolistID} as const)
export const setTodolists = (todolists: TodolistType[]) =>
    ({type: "SET-TODOLIST", todolists} as const)
export const changeTodolistEntityStatus = (todolistID: string, status: RequestStatusType) =>
    ({type: "TODOLIST/SET-TODOLIST-STATUS", todolistID, status} as const)

// thunks
export const getTodolists = (): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistAPI.getTodolists().then(response => {
        dispatch(setTodolists(response.data))
        dispatch(setAppStatus("succeeded"))
    })
}
export const addTodolist = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    todolistAPI.addTodolist(title)
        .then(response => {
            if(response.data.resultCode === 0) {
                dispatch(addTodolistAC(response.data.data.item))
                dispatch(setAppStatus("succeeded"))
            } else {
                if(response.data.messages.length) {
                    dispatch(setError(response.data.messages[0]))
                } else {
                    dispatch(setError("Some error"))
                }
                dispatch(setAppStatus("failed"))
            }

        })
        .catch(error => {
            dispatch(setError(error.message))
            dispatch(setAppStatus("failed"))
        })
}
export const removeTodolist = (todolistID: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus("loading"))
    dispatch(changeTodolistEntityStatus(todolistID, "loading"))
    todolistAPI.removeTodolist(todolistID)
        .then(response => {
            response.data.resultCode === 0 && dispatch(removeTodolistAC(todolistID))
            dispatch(setAppStatus("succeeded"))
            dispatch(changeTodolistEntityStatus(todolistID, "succeeded"))
        })
        .catch(error => {
            dispatch(setError(error.message))
            dispatch(setAppStatus("failed"))
        })
}
export const updateTodolistTitle = (todolistID: string, title: string): AppThunk =>
    (dispatch, getState) => {
        dispatch(setAppStatus("loading"))
        const todolist = getState().todolists.find(tl => tl.id === todolistID)
        todolist && todolistAPI.updateTodolist(todolistID, title)
            .then(response => {
                response.data.resultCode === 0 && dispatch(changeTodolistTitleAC(title, todolistID))
                dispatch(setAppStatus("succeeded"))
            })
            .catch(error => {
                dispatch(setError(error.message))
                dispatch(setAppStatus("failed"))
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