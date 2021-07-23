import React, {useCallback} from "react";
import {Button, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {logout} from "../store/auth-reducer";

type AppMenuPropsType = {
    isLoggedIn: boolean
}

export const AppMenu: React.FC<AppMenuPropsType> = props => {
    const dispatch = useDispatch()
    const logoutHandler = useCallback(() => {
        dispatch(logout())
    }, [])

    return (
        <Toolbar style={{justifyContent: "space-between"}}>
            <IconButton color={"inherit"}>
                <Menu/>
            </IconButton>
            <Typography variant={"h6"}>TODOLISTS</Typography>
            {props.isLoggedIn && <Button onClick={logoutHandler} color={"inherit"} variant={"outlined"}>Log out</Button>}
        </Toolbar>
    )
}