import React from "react";
import {Button, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export const AppMenu: React.FC = () => {
    return (
        <Toolbar style={{justifyContent: "space-between"}}>
            <IconButton color={"inherit"}>
                <Menu/>
            </IconButton>
            <Typography variant={"h6"}>
                Todolists
            </Typography>
            <Button color={"inherit"} variant={"outlined"}>
                Login
            </Button>
        </Toolbar>
    )
}