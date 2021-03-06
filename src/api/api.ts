import axios from "axios";

const instanse = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "4fe92c3a-1b95-46fb-8296-15a97f910aa4"
    }
})

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: D
}

export const todolistAPI = {
    getTodolists() {
        return instanse.get<TodolistType[]>("todo-lists")
    },
    addTodolist(title: string) {
        return instanse.post<ResponseType<{item: TodolistType}>>("todo-lists", {title})
    },
    updateTodolist(todolistId: string, title: string) {
        return instanse.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    removeTodolist(todolistId: string) {
        return instanse.delete<ResponseType>(`todo-lists/${todolistId}`)
    }
}
type GetTasksType = {
    items: TaskType[]
    totalCount: number
    error: string | null
}
export type TaskType = UpdateTaskType & {
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum ServerResponses {
    Success = 0,
    Error = 1,
    captchaSuccess = 10
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
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export const taskAPI = {
    getTasks(todolistId: string) {
        return instanse.get<GetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instanse.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, newTaskData: UpdateTaskType) {
        return instanse.put<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, newTaskData)
    },
    removeTask(todolistId: string, taskId: string) {
        return instanse.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export type AuthDataType = {
    id: number,
    login: string,
    email: string
}

export type LoginRequestType = {
    email: string
    password: string
    rememberMe: boolean
}

export const authAPI = {
    authMe() {
        return instanse.get<ResponseType<AuthDataType>>(`auth/me`)
    },
    login(data: LoginRequestType) {
        return instanse.post<ResponseType<{userId: number}>>(`auth/login`, data)
    },
    logout() {
        return instanse.delete<ResponseType>(`auth/login`)
    }
}