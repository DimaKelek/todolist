import {FilterTaskType, TodolistType} from "../App";
import {v1} from "uuid";

type RemoveTodolistType = {
    type: "REMOVE-TODOLIST"
    todolistID: string
}
type AddTodolistType = {
    type: "ADD-TODOLIST"
    title: string
}
type ChangeTodolistTitleType = {
    type: "CHANGE-TODOLIST-TITLE"
    newTitle: string
    todolistID: string
}
type ChangeFilterType = {
    type: "CHANGE-FILTER"
    value: FilterTaskType
    todolistID: string
}

export type ActionsType = RemoveTodolistType | AddTodolistType | ChangeTodolistTitleType | ChangeFilterType

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