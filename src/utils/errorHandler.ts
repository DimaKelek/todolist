import {Dispatch} from "redux"
import {AppReducerActionsType, setAppStatus, setError} from "../store/app-reducer";
import {ResponseType} from "../api/api"

export const handleServerAppError = <T>(error: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if(error.messages.length) {
        dispatch(setError({error: error.messages[0]}))
    } else {
        dispatch(setError({error: "Some error"}))
    }
    dispatch(setAppStatus({status: "failed"}))
}
export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setError({error: error.message}))
    dispatch(setAppStatus({status: "failed"}))
}

type ErrorUtilsDispatchType = Dispatch<AppReducerActionsType>