import * as Koa from "koa";
import * as Logger from "koa-logger";

import * as api from "./api";

const app = new Koa();

app.use(Logger());
api.init(app);

export default app;
