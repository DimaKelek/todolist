import React, {useCallback} from "react";
import S from "./Todolist.module.css"
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {addTaskAC, TaskType} from "../../store/task-reducer";
import {changeFilterAC, changeTodolistTitleAC, FilterTaskType, removeTodolistAC} from "../../store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../store/store";
import {Task} from "../Task/Task";

type TodolistPropsType = {
    todolistID: string
    title: string
    filter: FilterTaskType
}

export const Todolist = React.memo((props: TodolistPropsType) => {
    const tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const dispatch = useDispatch()

    let tasksForTodolist = tasks;
    if (props.filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    } else if (props.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }

    const renderTasks = tasksForTodolist.map(t => <Task key={t.id} task={t} todolistID={props.todolistID}/>)

    //---callbacks---//
    const onClickAll = useCallback(() => {
        dispatch(changeFilterAC("all", props.todolistID))
    }, [dispatch, props.todolistID]);

    const onClickActive = useCallback(() => {
        dispatch(changeFilterAC("active", props.todolistID))
    }, [dispatch, props.todolistID]);

    const onClickCompleted = useCallback(() => {
        dispatch(changeFilterAC("completed", props.todolistID))
    }, [dispatch, props.todolistID]);

    const deleteTodolist = useCallback(() => {
        dispatch(removeTodolistAC(props.todolistID))
    }, [dispatch, props.todolistID])

    const addItem = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.todolistID))
    }, [dispatch, props.todolistID])

    const changeTodolistTitle = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleAC(newTitle, props.todolistID))
    }, [dispatch, props.todolistID])

    return (
        <div className={S.todolist}>
            <h3>
                <EditableSpan title={props.title} onChangeTitle={changeTodolistTitle}/>
                <IconButton onClick={deleteTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addItem}/>
            <ul>{renderTasks}</ul>
            <div>
                <Button
                    onClick={onClickAll}
                    variant={props.filter === "all" ? "contained" : "text"}
                    color={"primary"}
                >All</Button>
                <Button
                    onClick={onClickActive}
                    variant={props.filter === "active" ? "contained" : "text"}
                    color={"primary"}
                >Active</Button>
                <Button
                    onClick={onClickCompleted}
                    variant={props.filter === "completed" ? "contained" : "text"}
                    color={"primary"}
                >Completed</Button>
            </div>
        </div>
    );
})