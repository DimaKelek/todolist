import {todolistAPI, TodolistType} from "../api/api";
import {AppThunk} from "./store";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (todolists = initialState, action: TodolistActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistID)
        case "ADD-TODOLIST":
            return [...todolists, {...action.todolist, filter: "all"}]
        case "CHANGE-TODOLIST-TITLE":
            let copyTodolists = [...todolists]
            let todolist = copyTodolists.find(tl => tl.id === action.todolistID)
            todolist && (todolist.title = action.newTitle)
            return copyTodolists
        case "CHANGE-FILTER":
            return todolists.map(tl => tl.id === action.todolistID ? {...tl, filter: action.value} : tl)
        case "SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
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

// thunks
export const getTodolists = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolists().then(response => {
        dispatch(setTodolists(response.data))
    })
}
export const addTodolist = (title: string): AppThunk => (dispatch) => {
    todolistAPI.addTodolist(title)
        .then(response => {
            response.data.resultCode === 0 && dispatch(addTodolistAC(response.data.data.item))
        })
}
export const removeTodolist = (todolistID: string): AppThunk => (dispatch) => {
    todolistAPI.removeTodolist(todolistID)
        .then(response => {
            response.data.resultCode === 0 && dispatch(removeTodolistAC(todolistID))
        })
}
export const updateTodolistTitle = (todolistID: string, title: string): AppThunk =>
    (dispatch, getState) => {
        const todolist = getState().todolists.find(tl => tl.id === todolistID)
        todolist && todolistAPI.updateTodolist(todolistID, title)
            .then(response => {
                response.data.resultCode === 0 && dispatch(changeTodolistTitleAC(title, todolistID))
            })
    }

// types
export type TodolistActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodolists>

export type FilterTaskType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {filter: FilterTaskType }