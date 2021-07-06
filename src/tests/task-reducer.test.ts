import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer, TaskStateType} from "../store/task-reducer";
import {TaskPriorities, TaskStatuses} from "../api/api";

let state: TaskStateType;

beforeEach(() => {
    state = {
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
    }
})

test('correct task should be removed', () => {
    const action = removeTaskAC("1", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"].length).toBe(0)
});

test('correct task should be added', () => {
    const action = addTaskAC("MobX", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"][0].title).toBe("MobX")
    expect(endState["todolistID_1"].length).toBe(2)
});

test('correct task status should be changed', () => {
    const action = changeStatusAC("2", true, "todolistID_2")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_2"][0].completed).toBe(true)
});

test('correct task title should be changed', () => {
    const action = changeTaskTitleAC("HTML5", "1", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"][0].title).toBe("HTML5")
});