import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    onChangeTitle: (title: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)

    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.onChangeTitle(title)
    }
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return (
        editMode
            ? <TextField
                value={title}
                onChange={onChangeTitle}
                autoFocus
                onBlur={offEditMode}
              />
            : <div style={{display: "inline-block", minWidth: "50px"}} onDoubleClick={onEditMode}>{props.title}</div>
    );
}