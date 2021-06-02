import {FilterTaskType, TodolistType} from "../App";
import {v1} from "uuid";
import {todolistID_1, todolistID_2} from "./task-reducer";

export type ActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>

const initialState: Array<TodolistType> = [
    {id: todolistID_1, title: "What to learn", filter: "all"},
    {id: todolistID_2, title: "What to buy", filter: "all"}
]

export const todolistsReducer = (todolists: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistID)
        case "ADD-TODOLIST":
            let newTodolist: TodolistType = {
                id: action.todolistID,
                title: action.title,
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