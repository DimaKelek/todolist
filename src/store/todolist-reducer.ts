import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/api";
import {Dispatch} from "react";
import {AppStateType} from "./store";

export type TodolistActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodolists>

export type FilterTaskType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterTaskType
}
const initialState: TodolistDomainType[] = []

export const todolistsReducer = (todolists: TodolistDomainType[] = initialState, action: TodolistActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistID)
        case "ADD-TODOLIST":
            return [...todolists, {...action.todolist, filter: "all"}]
        case "CHANGE-TODOLIST-TITLE":
            let todolist = todolists.find(tl => tl.id === action.todolistID)
            if (todolist) {
                todolist.title = action.newTitle
            }
            return [...todolists]
        case "CHANGE-FILTER":
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        case "SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        default:
            return todolists
    }
}

export const removeTodolistAC = (todolistID: string) => {
    return {type: "REMOVE-TODOLIST", todolistID} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: "ADD-TODOLIST", todolist} as const
}
export const changeTodolistTitleAC = (newTitle: string, todolistID: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", newTitle, todolistID} as const
}
export const changeFilterAC = (value: FilterTaskType, todolistID: string) => {
    return {type: "CHANGE-FILTER", value, todolistID} as const
}
//////////////////////////////
export const setTodolists = (todolists: TodolistType[]) => {
    return {type: "SET-TODOLIST", todolists} as const
}

///////////////////////////////
export const getTodolists = () => {
    return (dispatch: Dispatch<any>) => {
        todolistAPI.getTodolists()
            .then(response => {
                dispatch(setTodolists(response.data))
            })
    }
}

export const addTodolist = (title: string) => {
    return (dispatch: Dispatch<any>) => {
        todolistAPI.addTodolist(title)
            .then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(addTodolistAC(response.data.data.item))
                }
            })
    }
}

export const updateTodolistTitle = (todolistID: string, title: string) => {
    return (dispatch: Dispatch<any>, getState: () => AppStateType) => {
        const todolist = getState().todolists.find(tl => tl.id === todolistID)
        if(todolist) {
            todolistAPI.updateTodolist(todolistID, title)
                .then(response => {
                    if(response.data.resultCode === 0) {
                        dispatch(changeTodolistTitleAC(title, todolistID))
                    }
                })
        }
    }
}

export const removeTodolist = (todolistID: string) => {
    return (dispatch: Dispatch<any>) => {
        todolistAPI.removeTodolist(todolistID)
            .then(response => {
                if(response.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistID))
                }
            })
    }
}