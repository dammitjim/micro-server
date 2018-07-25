import * as Koa from "koa";
import * as Logger from "koa-logger";
import { Model } from "objection";
import * as Knex from "knex";

import * as api from "./api";

const knexConfig = require("../knexfile");

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = new Koa();

app.use(Logger());
api.init(app);

app.listen(3030);
console.log("Server running on port 3030");
