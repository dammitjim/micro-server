import { transaction } from "objection";
import * as Router from "koa-router";

import { CreateTaskRequestBody, UpdateTaskRequestBody } from "./interfaces";
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
            .select("id", "title", "text", "completed", "completedAt")
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
            .select("id", "title", "text", "completed", "completedAt")
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first();

        if (!task) {
            ctx.status = 404;
            ctx.body = {
                message: "Not Found"
            };

            return;
        }

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
                // TODO: utc date here
                createdAt: new Date(),
                ...body
            };
            return Task.query(trx).insertGraph(insert);
        });

        ctx.status = 201;
        ctx.body = {
            data: insertedGraph
        };
    }

    public async update(ctx: Router.IRouterContext) {
        const state = ctx.state.user as JWTState;
        const body = ctx.request.body as UpdateTaskRequestBody;

        if (ctx.params.id !== body.id) {
            // TODO: raise exception
            ctx.status = 404;
            ctx.body = {
                message: "Not Found"
            };
            return;
        }

        const task = await Task.query()
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first()
            .update(body)
            .returning(["id", "title", "text", "completed", "completedAt"]);

        ctx.body = {
            data: task
        };
    }

    public async delete(ctx: Router.IRouterContext) {
        const state = ctx.state.user as JWTState;
        await Task.query()
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first()
            .delete();

        ctx.body = {
            message: "Task has been deleted."
        };
    }
}
