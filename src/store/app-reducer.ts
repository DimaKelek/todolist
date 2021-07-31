import {AppThunk} from "./store";
import {authAPI, ServerResponses} from "../api/api";
import {setIsLoggedIn} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorHandler";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setError(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setInitialized(state, action: PayloadAction<{value: boolean}>) {
            state.isInitialized = action.payload.value
        }
    }
})
export const {setInitialized, setAppStatus, setError} = appSlice.actions
// thunk
export const authMe = (): AppThunk => async dispatch => {
    try {
        const response = await authAPI.authMe()
        if (response.data.resultCode === ServerResponses.Success) {
            dispatch(setIsLoggedIn({value: true}));
        } else {
            handleServerAppError(response.data, dispatch)
        }
        dispatch(setInitialized({value: true}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        dispatch(setInitialized({value: true}))
    }
}

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type AppReducerActionsType =
    ReturnType<typeof setAppStatus>
    | ReturnType<typeof setError>
    | ReturnType<typeof setInitialized>