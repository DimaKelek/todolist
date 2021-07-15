import {applyMiddleware, combineReducers, createStore} from "redux";
import {TaskActionsType, tasksReducer} from "./task-reducer";
import {TodolistActionsType, todolistsReducer} from "./todolist-reducer";
import thunkMiddleware, { ThunkAction } from "redux-thunk";
import {appReducer, AppReducerActionsType} from "./app-reducer";
import {authReducer} from "./auth-reducer";

// store
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

// types
export type AppStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TaskActionsType | TodolistActionsType | AppReducerActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>


//@ts-ignore
window.store = store