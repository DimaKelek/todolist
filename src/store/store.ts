import {combineReducers} from "redux";
import {TaskActionsType, tasksSlice} from "./task-reducer";
import {TodolistActionsType, todolistsSlice} from "./todolist-reducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {AppReducerActionsType, appSlice} from "./app-reducer";
import {AuthActionsType, authSlice} from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

// store
const rootReducer = combineReducers({
    tasks: tasksSlice.reducer,
    todolists: todolistsSlice.reducer,
    app: appSlice.reducer,
    auth: authSlice.reducer
})
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})
// types
export type AppStateType = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, AppActionsType>
export type AppActionsType =
    TaskActionsType
    | TodolistActionsType
    | AppReducerActionsType
    | AuthActionsType


//@ts-ignore
window.store = store