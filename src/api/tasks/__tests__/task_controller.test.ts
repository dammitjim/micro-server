import TaskController from "../controller";

test("Should return some string", () => {
    expect(TaskController.someString()).toBe("Some stringerinos");
});
