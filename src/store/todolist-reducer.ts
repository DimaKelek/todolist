import {v1} from "uuid";
import {TodolistAPIType} from "../api/api";

export type TodolistActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodolists>

export type FilterTaskType = "all" | "active" | "completed"

export type TodolistType = TodolistAPIType & {
    filter: FilterTaskType
}
const initialState: TodolistType[] = []

export const todolistsReducer = (todolists: TodolistType[] = initialState, action: TodolistActionsType): TodolistType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistID)
        case "ADD-TODOLIST":
            let newTodolist: TodolistType = {
                id: action.todolistID,
                title: action.title,
                addedDate: new Date().toDateString(),
                order: 0,
                filter: "all"
            }
            return [...todolists, newTodolist]
        case "CHANGE-TODOLIST-TITLE":
            let todolist = todolists.find(tl => tl.id === action.todolistID)
            if (todolist) {
                todolist.title = action.newTitle
            }
            return [...todolists]
        case "CHANGE-FILTER":
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        case "SET-TODOLIST":
            return []
        default:
            return todolists
    }
}

export const removeTodolistAC = (todolistID: string) => {
    return {type: "REMOVE-TODOLIST", todolistID} as const
}
export const addTodolistAC = (title: string) => {
    return {type: "ADD-TODOLIST", title, todolistID: v1()} as const
}
export const changeTodolistTitleAC = (newTitle: string, todolistID: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", newTitle, todolistID} as const
}
export const changeFilterAC = (value: FilterTaskType, todolistID: string) => {
    return {type: "CHANGE-FILTER", value, todolistID} as const
}
//////////////////////////////
export const setTodolists = (todolists: TodolistAPIType[]) => {
    return {type: "SET-TODOLIST", todolists} as const
}

///////////////////////////////
