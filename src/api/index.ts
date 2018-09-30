import * as Koa from "koa";
import * as Router from "koa-router";

import { initTaskRoutes } from "./tasks/routes";
import { initUsersRoutes } from "./users/routes";

export function init(server: Koa) {
    const v1Router = new Router({
        prefix: "/api/v1",
    });

    v1Router.use(initTaskRoutes(server).routes());
    v1Router.use(initUsersRoutes(server).routes());

    server.use(v1Router.routes());
}
