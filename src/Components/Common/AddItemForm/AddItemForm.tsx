import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null)
    }
    const addItemClick = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
            setError(null)
        } else {
            setError("Title is required!!!")
        }
        setTitle("")
    }

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            props.addItem(title)
            setTitle("")
        }
    }
    return (
        <div style={{height: "80px"}}>
            <TextField
                value={title}
                onChange={changeTitle}
                onKeyPress={onKeyPress}
                label="Task title"
                variant="outlined"
                helperText={error}
                error={!!error}
                disabled={props.disabled}
            />
            <IconButton onClick={addItemClick} disabled={props.disabled}>
                <AddBox color={props.disabled ? "disabled" : "primary"} />
            </IconButton>
        </div>
    );
})