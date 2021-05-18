import {FilterTaskType, TodolistType} from "../App";
import {v1} from "uuid";

export type ActionsType =
    ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof ChangeTodolistTitleAC>
    | ReturnType<typeof ChangeFilterAC>

export const todolistsReducer = (todolists: Array<TodolistType>, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistID)
        case "ADD-TODOLIST":
            const newTodolistID = v1()
            let newTodolist: TodolistType = {
                id: newTodolistID,
                title: action.title,
                filter: "all"
            }
            return [...todolists, newTodolist]
        case "CHANGE-TODOLIST-TITLE":
            let todolist = todolists.find(tl => tl.id === action.todolistID)
            if (todolist) {todolist.title = action.newTitle}
            return [...todolists]
        case "CHANGE-FILTER":
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        default:
            return todolists
    }
}

export const RemoveTodolistAC = (todolistID: string) => {
    return {type: "REMOVE-TODOLIST", todolistID: todolistID} as const
}
export const AddTodolistAC = (title: string) => {
    return {type: "ADD-TODOLIST", title: title} as const
}
export const ChangeTodolistTitleAC = (newTitle: string, todolistID: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", newTitle: newTitle, todolistID: todolistID} as const
}
export const ChangeFilterAC = (value: FilterTaskType, todolistID: string) => {
    return {type: "CHANGE-FILTER", value: value, todolistID: todolistID} as const
}