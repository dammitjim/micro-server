import { transaction } from "objection";
import * as Router from "koa-router";

import { CreateTaskRequestBody } from "./interfaces";
import { ListController } from "../common/controller";
import { JWTState } from "../common/auth";
import Task from "../../models/task";

export default class TaskController extends ListController<Task> {
    constructor(router: Router) {
        super(router, "task_list");
    }

    public async index(ctx: Router.IRouterContext) {
        const state = ctx.state.user as JWTState;
        const tasks = await Task.query()
            .where("user_id", "=", state.id)
            .page(ctx.query.page, this.LIST_PAGINATION);
        ctx.body = this.getResponseBody(tasks, ctx.query.page);
    }

    /**
     * Task detail view
     * @param ctx incoming router context
     */
    public async detail(ctx: Router.IRouterContext) {
        const state = ctx.state.user as JWTState;
        const task = await Task.query()
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first();

        ctx.body = {
            data: task
        };
    }

    public async create(ctx: Router.IRouterContext) {
        const state = ctx.state.user as JWTState;
        const body = ctx.request.body as CreateTaskRequestBody;

        const insertedGraph = await transaction(Task.knex(), trx => {
            const insert = {
                user_id: state.id,
                createdAt: new Date(),
                ...body
            };
            return Task.query(trx).insertGraph(insert);
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
