import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert'
import {useDispatch, useSelector} from "react-redux";
import {setAppStatus} from "../../../store/app-reducer";
import {AppStateType} from "../../../store/store";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export function ComplitedSnackbar() {
    const status = useSelector<AppStateType, string | null>(state => state.app.status)
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppStatus("idle"))
    }

    return (
        <Snackbar open={status === "succeeded"} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                Success Motherfucker))
            </Alert>
        </Snackbar>
    )
}
