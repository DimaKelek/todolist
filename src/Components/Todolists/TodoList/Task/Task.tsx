import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../Common/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {deleteTask, updateTaskStatus, updateTaskTitle} from "../../../../store/task-reducer";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "../../../../api/api";
import {RequestStatusType} from "../../../../store/app-reducer";

type TaskPropsType = {
    todolistID: string
    task: TaskType
    entityTaskStatus: RequestStatusType
}

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const removeTask = useCallback(() => {
        dispatch(deleteTask(props.todolistID, props.task.id))
    }, [dispatch, props.task.id, props.todolistID])

    const changeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDone = e.currentTarget.checked
        dispatch(updateTaskStatus(props.todolistID, props.task.id, newIsDone ? TaskStatuses.Completed : TaskStatuses.New))
    }, [dispatch, props.task.id, props.todolistID])

    const changeTitle = useCallback((newTitle: string) => {
        dispatch(updateTaskTitle(props.todolistID, props.task.id, newTitle))
    }, [dispatch, props.task.id, props.todolistID])

    return (
        <li className={props.task.status ? "is-done" : ""}>
            <Checkbox color={"primary"} disabled={props.entityTaskStatus === "loading"}
                      onChange={changeStatus} checked={props.task.status === TaskStatuses.Completed}/>
            <EditableSpan title={props.task.title} onChangeTitle={changeTitle}
                          disabled={props.entityTaskStatus === "loading"}/>
            <IconButton onClick={removeTask} disabled={props.entityTaskStatus === "loading"}>
                <Delete color={props.entityTaskStatus === "loading" ? "disabled" : "primary"}/>
            </IconButton>
        </li>
    )
})