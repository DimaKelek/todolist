import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../Common/AddItemForm/AddItemForm";
import {EditableSpan} from "../../Common/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {addTask, getTasks, TaskDomainType} from "../../../store/task-reducer";
import {changeFilterAC, removeTodolist, TodolistDomainType, updateTodolistTitle} from "../../../store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../store/store";
import {TaskStatuses} from "../../../api/api";
import {Task} from "./Task/Task";
import {RequestStatusType} from "../../../store/app-reducer";
import S from "./Todolist.module.css"

type TodolistPropsType = {
    todolist: TodolistDomainType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo((props: TodolistPropsType) => {
    const tasks = useSelector<AppStateType, Array<TaskDomainType>>(state => state.tasks[props.todolist.id])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasks(props.todolist.id))
    }, [dispatch, props.todolist.id])

    let tasksForTodolist = tasks;
    if (props.todolist.filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    } else if (props.todolist.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const renderTasks = tasksForTodolist
        .map(t => <Task key={t.id} task={t} todolistID={props.todolist.id} entityTaskStatus={t.entityTaskStatus}/>)

    //---callbacks---//
    const onClickAll = useCallback(() => {
        dispatch(changeFilterAC("all", props.todolist.id))
    }, [dispatch, props.todolist.id]);

    const onClickActive = useCallback(() => {
        dispatch(changeFilterAC("active", props.todolist.id))
    }, [dispatch, props.todolist.id]);

    const onClickCompleted = useCallback(() => {
        dispatch(changeFilterAC("completed", props.todolist.id))
    }, [dispatch, props.todolist.id]);

    const deleteTodolist = useCallback(() => {
        dispatch(removeTodolist(props.todolist.id))
    }, [dispatch, props.todolist.id])

    const addItem = useCallback((title: string) => {
        dispatch(addTask(props.todolist.id, title))
    }, [dispatch, props.todolist.id])

    const changeTodolistTitle = useCallback((newTitle: string) => {
        dispatch(updateTodolistTitle(props.todolist.id, newTitle))
    }, [dispatch, props.todolist.id])

    return (
        <Paper elevation={10} className={S.todolist}>
            <div>
                <h3>
                    <EditableSpan title={props.todolist.title} onChangeTitle={changeTodolistTitle}
                                  disabled={props.entityStatus === "loading"}/>
                    <IconButton onClick={deleteTodolist} disabled={props.entityStatus === "loading"}>
                        <Delete/>
                    </IconButton>
                </h3>
                <AddItemForm placeholder={"Task title"} addItem={addItem} disabled={props.entityStatus === "loading"}/>
                <div className={S.task_box}>
                    <ul>{renderTasks}</ul>
                </div>
                <div>
                    <Button
                        onClick={onClickAll}
                        variant={props.todolist.filter === "all" ? "contained" : "text"}
                        color={"primary"}
                    >All</Button>
                    <Button
                        onClick={onClickActive}
                        variant={props.todolist.filter === "active" ? "contained" : "text"}
                        color={"primary"}
                    >Active</Button>
                    <Button
                        onClick={onClickCompleted}
                        variant={props.todolist.filter === "completed" ? "contained" : "text"}
                        color={"primary"}
                    >Completed</Button>
                </div>
            </div>
        </Paper>
    );
})