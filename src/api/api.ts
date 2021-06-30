import axios from "axios";

const instanse = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "4fe92c3a-1b95-46fb-8296-15a97f910aa4"
    }
})

export type TodolistAPIType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}

export const todolistAPI = {
    getTodolists() {
        return instanse.get<TodolistAPIType[]>("todo-lists")
    },
    addTodolist(title: string) {
        return instanse.post<ResponseType<{item: TodolistAPIType}>>("todo-lists", {title})
    },
    updateTodolist(todolistId: string, title: string) {
        return instanse.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    removeTodolist(todolistId: string) {
        return instanse.delete<ResponseType>(`todo-lists/${todolistId}`)
    }
}

export type TaskType = UpdateTaskType & {
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New,
    InProgress,
    Complited,
    Draft
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}
type UpdateTaskType = {
    title: string
    description: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export const taskAPI = {
    getTask(todolistId: string) {
        return instanse.get<TaskType>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instanse.post<ResponseType>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, newTaskData: UpdateTaskType) {
        return instanse.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, newTaskData)
    },
    removeTask(todolistId: string, taskId: string) {
        return instanse.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}