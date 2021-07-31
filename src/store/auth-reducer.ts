import {setAppStatus} from "./app-reducer";
import {AppThunk} from "./store";
import {authAPI, LoginRequestType, ServerResponses} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const {setIsLoggedIn} = authSlice.actions

// thunks
export const login = (data: LoginRequestType): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const response = await authAPI.login(data)
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(setIsLoggedIn({value: true}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const logout = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus({status: "loading"}))
        const response = await authAPI.logout()
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(setIsLoggedIn({value: false}))
            dispatch(setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

// types

export type AuthActionsType = ReturnType<typeof setIsLoggedIn>