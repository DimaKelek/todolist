import {tasksReducer, TaskStateType} from "../task-reducer";
import {addTodolistAC, todolistsReducer, TodolistType} from "../todolist-reducer";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {
        ["todolistID_1"]: [
            {id: "1", title: "HTML", isDone: true},
            {id: "2", title: "CSS", isDone: true},
            {id: "3", title: "JS", isDone: true},
            {id: "4", title: "React", isDone: false},
            {id: "5", title: "Redux", isDone: false}
        ],
        ["todolistID_2"]: [
            {id: "6", title: "book", isDone: true},
            {id: "7", title: "apples", isDone: true},
        ]
    };
    const startTodolistsState: Array<TodolistType> = [
        {id: "todolistId_1", title: "What to learn", filter: "all"},
        {id: "todolistId_2", title: "What to buy", filter: "all"}
    ];

    const action = addTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[2];
    const idFromTodolists = endTodolistsState[2].id;

    expect(idFromTasks).toBe(action.todolistID);
    expect(idFromTodolists).toBe(action.todolistID);

    expect(keys.length).toBe(3)
    expect(endTodolistsState.length).toBe(3)
});
