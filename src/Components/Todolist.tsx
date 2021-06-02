import React, {ChangeEvent} from "react";
import S from "./Todolist.module.css"
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from "../store/task-reducer";
import {changeFilterAC, changeTodolistTitleAC, FilterTaskType, removeTodolistAC} from "../store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../store/store";

type TodolistPropsType = {
    todolistID: string
    title: string
    filter: FilterTaskType
}

export function Todolist(props: TodolistPropsType) {
    const tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const dispatch = useDispatch()
    debugger
    let allTodolistTasks = tasks;
    let tasksForTodolist = allTodolistTasks;
    if (props.filter === "active") {
        tasksForTodolist = allTodolistTasks.filter(t => !t.isDone)
    } else if (props.filter === "completed") {
        tasksForTodolist = allTodolistTasks.filter(t => t.isDone)
    }
    const renderTasks = tasksForTodolist.map(t => {

        const removeTask = () => dispatch(removeTaskAC(t.id, props.todolistID))
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDone = e.currentTarget.checked
            dispatch(changeStatusAC(t.id, newIsDone, props.todolistID))
        }
        const changeTitle = (newTitle: string) => dispatch(changeTaskTitleAC(newTitle, t.id, props.todolistID))
        return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                <Checkbox color={"primary"} onChange={changeStatus} checked={t.isDone}/>
                <EditableSpan title={t.title} onChangeTitle={changeTitle}/>
                <IconButton onClick={removeTask}>
                    <Delete color={"primary"}/>
                </IconButton>
            </li>
        );
    })

    //---callbacks---//
    const onClickAll = () => dispatch(changeFilterAC("all", props.todolistID));
    const onClickActive = () => dispatch(changeFilterAC("active", props.todolistID));
    const onClickCompleted = () => dispatch(changeFilterAC("completed", props.todolistID));

    const deleteTodolist = () => dispatch(removeTodolistAC(props.todolistID))
    const addItem = (title: string) => dispatch(addTaskAC(title, props.todolistID))
    const changeTodolistTitle = (newTitle: string) => dispatch(changeTodolistTitleAC(newTitle, props.todolistID))

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
}