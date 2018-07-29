import * as Koa from "koa";
import * as Router from "koa-router";

import TaskController from "./task_controller";
import UserController from "./user_controller";

export function init(server: Koa) {
    const router = new Router({
        prefix: "/api/v1"
    });

    const taskController = new TaskController(router);

    router.get("root", "/", async ctx => (ctx.body = { message: "Welcome" }));
    router.get(
        "task_list",
        "/tasks",
        async ctx => await taskController.index(ctx)
    );
    router.post(
        "task_create",
        "/tasks",
        async ctx => await taskController.create(ctx)
    );
    router.get(
        "task_detail",
        "/tasks/:id",
        async ctx => await taskController.detail(ctx)
    );
    router.delete("task_delete", "/tasks/:id", async ctx =>
        taskController.delete(ctx)
    );
    router.put("task_update", "/tasks/:id", async ctx =>
        taskController.update(ctx)
    );

    const userController = new UserController(router);
    router.post(
        "user_create",
        "/users",
        async ctx => await userController.create(ctx)
    );
    router.post(
        "user_login",
        "/users/login",
        async ctx => await userController.login(ctx)
    );

    server.use(router.routes());
}
