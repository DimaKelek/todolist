import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "../task-reducer";
import {TaskStateType} from "../../App";

let state: TaskStateType;

beforeEach(() => {
    state = {
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
    }
})

test('correct task should be removed', () => {
    const action = removeTaskAC("1", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"][0].id).toBe("2")
    expect(endState["todolistID_1"].length).toBe(4)
});
test('correct task should be added', () => {
    const action = addTaskAC("MobX", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"][0].title).toBe("MobX")
    expect(endState["todolistID_1"].length).toBe(6)
});
test('correct task status should be changed', () => {
    const action = changeStatusAC("6", false, "todolistID_2")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_2"][0].isDone).toBe(false)
});
test('correct task title should be changed', () => {
    const action = changeTaskTitleAC("HTML5", "1", "todolistID_1")
    const endState = tasksReducer(state, action)

    expect(endState["todolistID_1"][0].title).toBe("HTML5")
});