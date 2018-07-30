import { transaction } from "objection";
import * as Router from "koa-router";
import { Page } from "objection";
import Task from "../../models/task";

interface IPaginatedController<T> {
    router: Router;
    getPreviousListPage(page: number): string;
    getNextListPage(page: number): string;
    getModelList(page: number): Promise<Page<T>>;
}

export default class TaskController implements IPaginatedController<Task> {
    readonly LIST_PAGINATION = 100;
    router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public static someString() {
        return "Some stringerinos";
    }

    public async getModelList(page: number): Promise<Page<Task>> {
        return await Task.query().page(page, this.LIST_PAGINATION);
    }

    public getPreviousListPage(page: number): string {
        let prevUrl = null;
        if (page > 1) {
            prevUrl = `${this.router.url("task_list", {})}?page=${page - 1}`;
        }
        return prevUrl;
    }

    public getNextListPage(page: number): string {
        let pageNo = 0;
        if (page > 0) {
            pageNo = Math.max(page, 0);
        }
        return `${this.router.url("task_list", {})}?page=${pageNo + 1}`;
    }

    public async index(ctx: Router.IRouterContext) {
        const tasks = await this.getModelList(ctx.query.page);
        ctx.body = {
            prev: this.getPreviousListPage(ctx.query.page),
            next: this.getNextListPage(ctx.query.page),
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
