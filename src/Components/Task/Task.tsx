import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {changeStatusAC, changeTaskTitleAC, removeTaskAC} from "../../store/task-reducer";
import {useDispatch} from "react-redux";
import {TaskType} from "../../api/api";

type TaskPropsType = {
    todolistID: string
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const removeTask = useCallback(() => {
        dispatch(removeTaskAC(props.task.id, props.todolistID))
    }, [dispatch, props.task.id, props.todolistID])

    const changeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDone = e.currentTarget.checked
        dispatch(changeStatusAC(props.task.id, newIsDone, props.todolistID))
    }, [dispatch, props.task.id, props.todolistID])

    const changeTitle = useCallback((newTitle: string) => {
        dispatch(changeTaskTitleAC(newTitle, props.task.id, props.todolistID))
    }, [dispatch, props.task.id, props.todolistID])

    return (
        <li className={props.task.completed ? "is-done" : ""}>
            <Checkbox color={"primary"} onChange={changeStatus} checked={props.task.completed}/>
            <EditableSpan title={props.task.title} onChangeTitle={changeTitle}/>
            <IconButton onClick={removeTask}>
                <Delete color={"primary"}/>
            </IconButton>
        </li>
    )
})