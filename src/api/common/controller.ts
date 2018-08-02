import * as Router from "koa-router";
import { Page } from "objection";

interface ListControllerResponseBody<T> {
    count: number;
    next: string;
    prev: string;
    data: T[];
}

export class ListController<T> {
    readonly LIST_PAGINATION = 100;
    router: Router;
    routeName: string;

    constructor(router: Router, routeName: string) {
        this.router = router;
        this.routeName = routeName;
    }

    public getListBody(
        items: Page<T>,
        page: number
    ): ListControllerResponseBody<T> {
        return {
            count: items.total,
            next: this.getNextPage(page),
            prev: this.getPreviousPage(page),
            data: items.results
        };
    }

    private getNextPage(page: number): string {
        let pageNo = 0;
        if (page > 0) {
            pageNo = Math.max(page, 0);
        }
        return `${this.router.url(this.routeName, {})}?page=${pageNo + 1}`;
    }

    private getPreviousPage(page: number): string {
        let prevUrl = null;
        if (page > 1) {
            prevUrl = `${this.router.url(this.routeName, {})}?page=${page - 1}`;
        }
        return prevUrl;
    }
}
