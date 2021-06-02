import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from '../todolist-reducer';
import {v1} from 'uuid';
import {FilterTaskType, TodolistType} from '../../App';

let todolistId_1: string;
let todolistId_2: string;
let startState: Array<TodolistType>

beforeEach(() => {
    todolistId_1 = v1()
    todolistId_2 = v1()
    startState = [
        {id: todolistId_1, title: "What to learn", filter: "all"},
        {id: todolistId_2, title: "What to buy", filter: "all"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId_1))
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId_2);
});
test('correct todolist should be added', () => {
    let newTodolistTitle = "New Todolist";
    const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle))
    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});
test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist Title";
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
