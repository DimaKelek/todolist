import {applyMiddleware, combineReducers, createStore} from "redux";
import {TaskActionsType, tasksReducer} from "./task-reducer";
import {TodolistActionsType, todolistsReducer} from "./todolist-reducer";
import thunkMiddleware, { ThunkAction } from "redux-thunk";

// store
const rootReducer = combineReducers({tasks: tasksReducer, todolists: todolistsReducer})
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

// types
export type AppStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TaskActionsType | TodolistActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>


//@ts-ignore
window.store = store