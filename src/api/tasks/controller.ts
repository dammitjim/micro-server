import * as Router from "koa-router";
import { transaction } from "objection";

import Task from "../../models/task";
import { IJWTState } from "../common/auth";
import { ListController } from "../common/controller";
import { NotFound } from "../common/messages";
import { ICreateTaskRequestBody, IUpdateTaskRequestBody } from "./interfaces";

export default class TaskController extends ListController<Task> {
    constructor(router: Router) {
        super(router, "task_list");
    }

    public async index(ctx: Router.IRouterContext) {
        const state = ctx.state.user as IJWTState;
        const tasks = await Task.query()
            .select("id", "title", "text", "completed", "completedAt")
            .where("user_id", "=", state.id)
            .page(ctx.query.page, this.LIST_PAGINATION);

        ctx.body = this.getListBody(tasks, ctx.query.page);
    }

    /**
     * Task detail view
     * @param ctx incoming router context
     */
    public async detail(ctx: Router.IRouterContext) {
        const state = ctx.state.user as IJWTState;
        const task = await Task.query()
            .select("id", "title", "text", "completed", "completedAt")
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first();

        if (!task) {
            ctx.status = 404;
            ctx.body = NotFound;
            return;
        }

        ctx.body = {
            data: task,
        };
    }

    public async create(ctx: Router.IRouterContext) {
        const state = ctx.state.user as IJWTState;
        const body = ctx.request.body as ICreateTaskRequestBody;

        const insertedGraph = await transaction(Task.knex(), trx => {
            const insert = {
                createdAt: new Date(),
                user_id: state.id,
                // TODO: utc date here
                ...body,
            };
            return Task.query(trx).insertGraph(insert);
        });

        ctx.status = 201;
        ctx.body = {
            data: insertedGraph,
        };
    }

    public async update(ctx: Router.IRouterContext) {
        const state = ctx.state.user as IJWTState;
        const body = ctx.request.body as IUpdateTaskRequestBody;

        if (ctx.params.id !== body.id) {
            // TODO: raise exception
            ctx.status = 404;
            ctx.body = NotFound;
            return;
        }

        const task = await Task.query()
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first()
            .update(body)
            .returning(["id", "title", "text", "completed", "completedAt"]);

        ctx.body = {
            data: task,
        };
    }

    public async delete(ctx: Router.IRouterContext) {
        const state = ctx.state.user as IJWTState;
        await Task.query()
            .where("id", "=", ctx.params.id)
            .where("user_id", "=", state.id)
            .first()
            .delete();

        ctx.body = {
            message: "Task has been deleted.",
        };
    }
}
