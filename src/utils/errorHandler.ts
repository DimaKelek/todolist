import {Dispatch} from "redux"
import {AppReducerActionsType, setAppStatus, setError} from "../store/app-reducer";
import {ResponseType} from "../api/api"

export const handleServerAppError = <T>(error: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if(error.messages.length) {
        dispatch(setError(error.messages[0]))
    } else {
        dispatch(setError("Some error"))
    }
    dispatch(setAppStatus("failed"))
}
export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setError(error.message))
    dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = Dispatch<AppReducerActionsType>