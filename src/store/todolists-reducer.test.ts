import {AddTodolistAC, ChangeFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC, todolistsReducer} from './todolist-reducer';
import {v1} from 'uuid';
import {FilterTaskType, TodolistType} from '../App';

test('correct todolist should be removed', () => {
    let todolistId_1 = v1();
    let todolistId_2 = v1();

    const startState: Array<TodolistType> = [
        {id: todolistId_1, title: "What to learn", filter: "all"},
        {id: todolistId_2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistsReducer(startState, RemoveTodolistAC(todolistId_1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId_2);
});
test('correct todolist should be added', () => {
    let todolistId_1 = v1();
    let todolistId_2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {id: todolistId_1, title: "What to learn", filter: "all"},
        {id: todolistId_2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistsReducer(startState, AddTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});
test('correct todolist should change its name', () => {
    let todolistId_1 = v1();
    let todolistId_2 = v1();

    let newTodolistTitle = "New Todolist Title";

    const startState: Array<TodolistType> = [
        {id: todolistId_1, title: "What to learn", filter: "all"},
        {id: todolistId_2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistsReducer(startState, ChangeTodolistTitleAC(newTodolistTitle, todolistId_2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});
test('correct filter of todolist should be changed', () => {
    let todolistId_1 = v1();
    let todolistId_2 = v1();

    let newFilter: FilterTaskType = "completed";

    const startState: Array<TodolistType> = [
        {id: todolistId_1, title: "What to learn", filter: "all"},
        {id: todolistId_2, title: "What to buy", filter: "all"}
    ]

    const endState = todolistsReducer(startState, ChangeFilterAC(newFilter, todolistId_2));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
