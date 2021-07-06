import {addTodolistAC, removeTodolistAC, setTodolists} from "./todolist-reducer";
import {taskAPI, TaskStatuses, TaskType} from "../api/api";
import {AppThunk} from "./store";

const initialState: TaskStateType = {}

export const tasksReducer = (tasks = initialState, action: TaskActionsType): TaskStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {...tasks, [action.todolistID]: tasks[action.todolistID]
                    .filter(t => t.id !== action.taskID)}
        case "ADD-TASK":
            return {...tasks, [action.task.todoListId]: [action.task, ...tasks[action.task.todoListId]]}
        case "CHANGE-STATUS":
            return {...tasks, [action.todolistID]: [...tasks[action.todolistID]]
                    .map(t => t.id === action.taskID ? {...t, status: action.status} : t)}
        case "CHANGE-TASK-TITLE":
            return {...tasks, [action.todolistID]: [...tasks[action.todolistID]
                    .map(t => t.id === action.taskID ? {...t, title: action.newTitle} : t)]}
        case "REMOVE-TODOLIST":
            let tasksCopy = {...tasks}
            delete (tasksCopy[action.todolistID])
            return tasksCopy
        case "ADD-TODOLIST":
            return {...tasks, [action.todolist.id]: []}
        case "SET-TODOLIST": {
            let tasksCopy = {...tasks}
            action.todolists.forEach(tl => tasksCopy[tl.id] = [])
            return tasksCopy
        }
        case "SET-TASKS":
            return {...tasks, [action.todolistID]: [...action.tasks]}
        default:
            return tasks
    }
}

// actions
export const removeTaskAC = (taskID: string, todolistID: string) =>
    ({type: "REMOVE-TASK", taskID, todolistID} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: "ADD-TASK", task} as const)
export const changeStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) =>
    ({type: "CHANGE-STATUS", taskID, status, todolistID} as const)
export const changeTaskTitleAC = (newTitle: string, taskID: string, todolistID: string) =>
    ({type: "CHANGE-TASK-TITLE", newTitle, taskID, todolistID} as const)
export const setTasks = (tasks: TaskType[], todolistID: string) =>
    ({type: "SET-TASKS", tasks, todolistID} as const)

// thunks
export const getTasks = (todolistID: string): AppThunk => (dispatch) => {
    taskAPI.getTasks(todolistID)
        .then(response => {
            dispatch(setTasks(response.data.items, todolistID))
        })
}
export const addTask = (todolistID: string, title: string): AppThunk => (dispatch) => {
    taskAPI.addTask(todolistID, title)
        .then(response => {
            response.data.resultCode === 0 && dispatch(addTaskAC(response.data.data.item))
        })
}
export const deleteTask = (todolistID: string, taskID: string): AppThunk => (dispatch) => {
    taskAPI.removeTask(todolistID, taskID)
        .then(response => {
            response.data.resultCode === 0 && dispatch(removeTaskAC(taskID, todolistID))
        })
}
export const updateTaskStatus = (todolistID: string, taskID: string, status: TaskStatuses): AppThunk =>
    (dispatch, getState) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID)
        if(task) {
            taskAPI.updateTask(todolistID, taskID, {
                title: task.title,
                status,
                description: task.description,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority
            }).then(response => {
                response.data.resultCode === 0 && dispatch(changeStatusAC(taskID, status, todolistID))
            })
        }
    }
export const updateTaskTitle = (todolistID: string, taskID: string, title: string): AppThunk =>
    (dispatch, getState) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID)
        if(task) {
            taskAPI.updateTask(todolistID, taskID, {
                title,
                status: task.status,
                description: task.description,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority
            }).then(response => {
                response.data.resultCode === 0 && dispatch(changeTaskTitleAC(title, taskID, todolistID))
            })
        }
    }

// types
export type TaskActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolists>
    | ReturnType<typeof setTasks>

export type TaskStateType = {[key: string]: Array<TaskType>}