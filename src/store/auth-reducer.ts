import {authMe, setAppStatus} from "./app-reducer";
import {AppThunk} from "./store";
import {authAPI, LoginRequestType, ServerResponses} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";

const initialState = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: AuthReducerActionsType): InitialStateType => {
    switch (action.type) {
        case "LOGIN/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default: return state
    }
}

// actions
export const setIsLoggedIn = (value: boolean) => ({type: "LOGIN/SET-IS-LOGGED-IN", value} as const)

// thunks
export const login = (data: LoginRequestType): AppThunk => dispatch => {
    dispatch(setAppStatus('loading'))
    authAPI.login(data)
        .then(response => {
            if(response.data.resultCode === 0) {
                dispatch(authMe())
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logout = (): AppThunk => dispatch => {
    dispatch(setAppStatus('loading'))
    authAPI.logout()
        .then(response => {
            if(response.data.resultCode === ServerResponses.Success) {
                dispatch(setIsLoggedIn(false))
                dispatch(setAppStatus("succeeded"))
            } else {
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
type InitialStateType = typeof initialState

export type AuthReducerActionsType = ReturnType<typeof setIsLoggedIn>