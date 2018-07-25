import * as Koa from "koa";
import * as Router from "koa-router";

import TaskController from "./task_controller";

export function init(server: Koa) {
    const router = new Router({
        prefix: "/api/v1"
    });

    const controller = new TaskController(router);

    router.get("task_list", "/tasks", async ctx => await controller.index(ctx));
    router.post(
        "task_create",
        "/tasks",
        async ctx => await controller.create(ctx)
    );
    router.get(
        "task_detail",
        "/tasks/:id",
        async ctx => await controller.detail(ctx)
    );
    router.delete("task_delete", "/tasks/:id", async ctx =>
        controller.delete(ctx)
    );
    router.put("task_update", "/tasks/:id", async ctx =>
        controller.update(ctx)
    );

    server.use(router.routes());
}
