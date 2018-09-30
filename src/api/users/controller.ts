import * as Argon2 from "argon2";
import * as JWT from "jsonwebtoken";
import * as Router from "koa-router";
import { transaction } from "objection";

import User from "../../models/user";

interface IUserCreateRequestBody {
    username: string;
    password: string;
}

interface IUserLoginRequestBody {
    username: string;
    password: string;
}

export default class UserController {
    public router: Router;

    public readonly LOGIN_FAILED_MESSAGE = "The username and password do not match.";

    constructor(router: Router) {
        this.router = router;
    }

    public async create(ctx: Router.IRouterContext) {
        // TODO: check if i need to sanitize this or if knex / objection does it for me
        const body = ctx.request.body as IUserCreateRequestBody;

        const user = await User.query().where("username", "=", body.username);
        if (user.length > 0) {
            // TODO: throw an error?
            ctx.status = 400;
            return;
        }

        let hashedPassword = "";
        try {
            hashedPassword = await Argon2.hash(body.password);
        } catch (err) {
            // TODO: handle
            ctx.status = 500;
            return;
        }

        await transaction(User.knex(), (trx) => {
            return User.query(trx).insertGraph({
                createdAt: new Date(),
                password: hashedPassword,
                username: body.username,
            });
        });

        ctx.status = 201;
        ctx.body = {
            message: "You have been successfully registered",
        };
    }

    public async login(ctx: Router.IRouterContext) {
        const body = ctx.request.body as IUserLoginRequestBody;
        const users = await User.query().where("username", "=", body.username);
        if (users.length === 0) {
            ctx.body = {
                message: this.LOGIN_FAILED_MESSAGE,
            };
            ctx.status = 400;
            return;
        }

        const user = users[0];
        try {
            if (!(await Argon2.verify(user.password, body.password))) {
                ctx.status = 400;
                ctx.body = {
                    message: this.LOGIN_FAILED_MESSAGE,
                };
                return;
            }
        } catch (err) {
            ctx.status = 500;
            return;
        }

        ctx.body = {
            data: {
                token: JWT.sign({ id: user.id }, "super secret"),
            },
        };
    }
}
