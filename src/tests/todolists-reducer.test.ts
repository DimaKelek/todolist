import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    FilterTaskType,
    removeTodolistAC,
    setTodolists,
    TodolistDomainType,
    todolistsReducer
} from '../store/todolist-reducer';
import {v1} from 'uuid';
import {TodolistType} from "../api/api";

let todolistId_1: string;
let todolistId_2: string;
let startState: TodolistDomainType[]
let startStateForApi: TodolistDomainType[]
let getTodolists: TodolistType[]

beforeEach(() => {
    todolistId_1 = v1()
    todolistId_2 = v1()
    startState = [
        {id: todolistId_1, title: "What to learn", filter: "all", order: 2, addedDate: "125", entityStatus: "idle"},
        {id: todolistId_2, title: "What to buy", filter: "all", order: 7, addedDate: "125", entityStatus: "idle"}
    ]
    startStateForApi = []
    getTodolists = [
        {id: todolistId_1, title: "1", order: 2, addedDate: "125"},
        {id: todolistId_2, title: "2", order: 7, addedDate: "125"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId_1))
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId_2);
});

test('correct todolist should be added', () => {
    let newTodolist = {id: todolistId_1, title: "1", order: 2, addedDate: "125"};
    const endState = todolistsReducer(startState, addTodolistAC(newTodolist))
    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe("1");
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New TodoList Title";
    const endState = todolistsReducer(startState, changeTodolistTitleAC(newTodolistTitle, todolistId_2));
    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterTaskType = "completed";
    const endState = todolistsReducer(startState, changeFilterAC(newFilter, todolistId_2));
    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct todolists should be added', () => {
    const endState = todolistsReducer(startStateForApi, setTodolists(getTodolists));
    expect(endState[0].title).toBe("1")
});


