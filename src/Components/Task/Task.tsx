import React, {ChangeEvent} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {changeStatusAC, changeTaskTitleAC, removeTaskAC} from "../../store/task-reducer";
import {useDispatch} from "react-redux";

type TaskPropsType = {
    taskId: string
    todolistID: string
    title: string
    isDone: boolean
}

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const removeTask = () => {
        dispatch(removeTaskAC(props.taskId, props.todolistID))
    }
    const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDone = e.currentTarget.checked
        dispatch(changeStatusAC(props.taskId, newIsDone, props.todolistID))
    }
    const changeTitle = (newTitle: string) => {
        dispatch(changeTaskTitleAC(newTitle, props.taskId, props.todolistID))
    }
    return (
        <li className={props.isDone ? "is-done" : ""}>
            <Checkbox color={"primary"} onChange={changeStatus} checked={props.isDone}/>
            <EditableSpan title={props.title} onChangeTitle={changeTitle}/>
            <IconButton onClick={removeTask}>
                <Delete color={"primary"}/>
            </IconButton>
        </li>
    )
})