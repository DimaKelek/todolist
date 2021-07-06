import {tasksReducer, TaskStateType} from "../store/task-reducer";
import {addTodolistAC, TodolistDomainType, todolistsReducer} from "../store/todolist-reducer";
import {TaskPriorities, TaskStatuses} from "../api/api";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {
        ["todolistID_1"]: [
            {id: "1", title: "HTML",
                completed: true, todoListId: "todolistID_1",
                status: TaskStatuses.New, startDate: "", addedDate: "",
                priority: TaskPriorities.Low, order: 0, description: "", deadline: "" },
        ],
            ["todolistID_2"]: [
            {id: "2", title: "Book",
                completed: false, todoListId: "todolistID_2",
                status: TaskStatuses.New, startDate: "", addedDate: "",
                priority: TaskPriorities.Low, order: 0, description: "", deadline: "" },
        ]
    };
    const startTodolistsState: Array<TodolistDomainType> = [
        {id: "todolistId_1", title: "What to learn", filter: "all", order: 2, addedDate: "125"},
        {id: "todolistId_2", title: "What to buy", filter: "all", order: 7, addedDate: "125"}
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
