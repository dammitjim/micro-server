import * as Koa from "koa";
import * as JWTMiddleware from "koa-jwt";
import * as Router from "koa-router";

import TaskController from "./controller";

export function initTaskRoutes(server: Koa): Router {
    const router = new Router({
        prefix: "/tasks",
    });

    const taskController = new TaskController(router);
    router.use(JWTMiddleware({ secret: "super secret" }));

    router.get(
        "task_list",
        "/",
        async (ctx) => await taskController.index(ctx),
    );
    router.post(
        "task_create",
        "/",
        async (ctx) => await taskController.create(ctx),
    );
    router.get(
        "task_detail",
        "/:id",
        async (ctx) => await taskController.detail(ctx),
    );
    router.delete("task_delete", "/:id", async (ctx) =>
        taskController.delete(ctx),
    );
    router.put("task_update", "/:id", async (ctx) =>
        taskController.update(ctx),
    );

    return router;
}
