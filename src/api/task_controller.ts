import { transaction } from "objection";
import * as Router from "koa-router";
import Task from "../models/task";

export default class TaskController {
    readonly LIST_PAGINATION = 100;
    router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public static someString() {
        return "Some string";
    }

    /**
     * Task list action
     * @param ctx incoming router context
     */
    public async index(ctx: Router.IRouterContext) {
        let pageNo = 0;
        if (ctx.query.page) {
            pageNo = Math.max(ctx.query.page - 1, 0);
        }

        const tasks = await Task.query().page(pageNo, this.LIST_PAGINATION);

        let prevUrl = null;
        if (pageNo > 0) {
            prevUrl = `${this.router.url("task_list", {})}?page=${pageNo - 1}`;
        }

        ctx.body = {
            prev: prevUrl,
            next: `${this.router.url("task_list", {})}?page=${pageNo + 2}`,
            total: tasks.total,
            data: tasks.results
        };
    }

    /**
     * Task detail view
     * @param ctx incoming router context
     */
    public async detail(ctx: Router.IRouterContext) {
        const tasks = await Task.query().where("id", "=", ctx.params.id);
        if (tasks.length == 0) {
            // TODO: handle
        }
        ctx.body = {
            data: tasks[0]
        };
    }

    public async create(ctx: Router.IRouterContext) {
        const insertedGraph = await transaction(Task.knex(), trx => {
            return Task.query(trx).insertGraph({
                title: "This is only a test",
                text: "This is my text",
                createdAt: new Date(),
                completed: false
            });
        });
        ctx.body = {
            data: insertedGraph
        };
    }

    public update(ctx: Router.IRouterContext): void {
        ctx.body = {
            message: "This is the tasks update API endpoint"
        };
    }

    public delete(ctx: Router.IRouterContext): void {
        ctx.body = {
            message: "This is the tasks delete API endpoint"
        };
    }
}
