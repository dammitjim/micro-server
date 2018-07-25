import TaskController from "../task_controller";

test("Should return some string", () => {
    expect(TaskController.someString()).toBe("Some string");
});
