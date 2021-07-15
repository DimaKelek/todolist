import {AppThunk} from "./store";
import {authAPI, ServerResponses} from "../api/api";
import {setIsLoggedIn} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";
import {changeTodolistEntityStatus} from "./todolist-reducer";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: true}
        default: return state
    }
}

// actions
export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setError = (error: string) => ({type: "APP/SET-ERROR", error} as const)
export const setInitialized = () => ({type: "APP/SET-INITIALIZED"} as const)

// thunk
export const authMe = (): AppThunk => dispatch => {
    authAPI.authMe()
        .then(response => {
            if (response.data.resultCode === ServerResponses.Success) {
                dispatch(setIsLoggedIn(true));
                dispatch(setInitialized())
            } else {
                handleServerAppError(response.data, dispatch)
                dispatch(setInitialized())
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })

}

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
type InitialStateType = typeof initialState

export type AppReducerActionsType =
    ReturnType<typeof setAppStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setIsLoggedIn>
    | ReturnType<typeof setInitialized>