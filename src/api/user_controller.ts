import * as Argon2 from "argon2";
import { transaction } from "objection";
import * as Router from "koa-router";

import User from "../models/user";

interface UserCreateRequestBody {
    username: string;
    password: string;
}

interface UserLoginRequestBody {
    username: string;
    password: string;
}

export default class UserController {
    router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public async create(ctx: Router.IRouterContext) {
        // TODO: check if i need to sanitize this or if knex / objection does it for me
        const body = ctx.request.body as UserCreateRequestBody;

        const user = await User.query().where("username", "=", body.username);
        if (user.length > 0) {
            // TODO: throw an error?
            console.log("user already exists");
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

        await transaction(User.knex(), trx => {
            return User.query(trx).insertGraph({
                username: body.username,
                password: hashedPassword,
                createdAt: new Date()
            });
        });

        ctx.status = 201;
        ctx.body = {
            message: "You have been successfully registered"
        };
    }

    public async login(ctx: Router.IRouterContext) {
        const body = ctx.request.body as UserLoginRequestBody;
        const users = await User.query().where("username", "=", body.username);
        if (users.length == 0) {
            // TODO: login failed message
            ctx.status = 400;
            return;
        }

        const user = users[0];
        try {
            if (!(await Argon2.verify(user.password, body.password))) {
                // TODO: login failed message
                ctx.status = 400;
                return;
            }
        } catch (err) {
            // TODO: handle
            ctx.status = 500;
            return;
        }

        // TODO: JWT generate here
        ctx.body = {
            message: "You have successfully logged in"
        };
    }
}
