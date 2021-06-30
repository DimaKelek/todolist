import React, {ChangeEvent, useCallback, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    onChangeTitle: (title: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)

    const onEditMode = () => setEditMode(true)
    const offEditMode = useCallback(() => {
        setEditMode(false)
        props.onChangeTitle(title)
    }, [title, props])

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
})