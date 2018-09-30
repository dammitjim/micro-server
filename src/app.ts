import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Logger from "koa-logger";

import * as api from "./api";

const app = new Koa();

app.use(Logger());
app.use(BodyParser());
api.init(app);

export default app;
