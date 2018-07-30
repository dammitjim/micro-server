import * as Koa from "koa";
import * as Router from "koa-router";
import * as JWTMiddleware from "koa-jwt";

import TaskController from "./task_controller";
import UserController from "./user_controller";

export function init(server: Koa) {
    const taskRouter = new Router({
        prefix: "/api/v1/tasks"
    });

    const taskController = new TaskController(taskRouter);
    taskRouter.use(JWTMiddleware({ secret: "super secret" }));

    taskRouter.get(
        "task_list",
        "/",
        async ctx => await taskController.index(ctx)
    );
    taskRouter.post(
        "task_create",
        "/",
        async ctx => await taskController.create(ctx)
    );
    taskRouter.get(
        "task_detail",
        "/:id",
        async ctx => await taskController.detail(ctx)
    );
    taskRouter.delete("task_delete", "/:id", async ctx =>
        taskController.delete(ctx)
    );
    taskRouter.put("task_update", "/:id", async ctx =>
        taskController.update(ctx)
    );

    server.use(taskRouter.routes());

    const userRouter = new Router({
        prefix: "/api/v1/users"
    });
    const userController = new UserController(userRouter);
    userRouter.post(
        "user_create",
        "/",
        async ctx => await userController.create(ctx)
    );
    userRouter.post(
        "user_login",
        "/login",
        async ctx => await userController.login(ctx)
    );

    server.use(userRouter.routes());
}
