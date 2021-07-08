const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null
}

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default: return state
    }
}

// actions
export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setError = (error: string) => ({type: "APP/SET-ERROR", error} as const)

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
type InitialStateType = typeof initialState

export type AppReducerActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setError>