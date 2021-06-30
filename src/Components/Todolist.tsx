import React, {useCallback} from "react";
import S from "./Todolist.module.css"
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {addTaskAC, TaskType} from "../store/task-reducer";
import {changeFilterAC, changeTodolistTitleAC, FilterTaskType, removeTodolistAC} from "../store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../store/store";
import {Task} from "./Task/Task";

type TodolistPropsType = {
    todolistID: string
    title: string
    filter: FilterTaskType
}

export const Todolist = React.memo((props: TodolistPropsType) => {
    console.log("todolist");
    const tasks = useSelector<AppStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const dispatch = useDispatch()

    let tasksForTodolist = tasks;
    if (props.filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    } else if (props.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }

    const renderTasks = tasksForTodolist.map(t => {
        return (
            <Task
                key={t.id}
                taskId={t.id}
                todolistID={props.todolistID}
                title={t.title}
                isDone={t.isDone}
            />
        );
    })

    //---callbacks---//
    const onClickAll = () => dispatch(changeFilterAC("all", props.todolistID));
    const onClickActive = () => dispatch(changeFilterAC("active", props.todolistID));
    const onClickCompleted = () => dispatch(changeFilterAC("completed", props.todolistID));

    const deleteTodolist = () => dispatch(removeTodolistAC(props.todolistID))
    const addItem = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.todolistID))
    }, [dispatch, props.todolistID])
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
})