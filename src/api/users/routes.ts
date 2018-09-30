import * as Koa from "koa";
import * as Router from "koa-router";

import UserController from "./controller";

export function initUsersRoutes(server: Koa): Router {
    const router = new Router({
        prefix: "/users",
    });
    const userController = new UserController(router);
    router.post(
        "user_create",
        "/",
        async (ctx) => await userController.create(ctx),
    );
    router.post(
        "user_login",
        "/login",
        async (ctx) => await userController.login(ctx),
    );

    return router;
}
