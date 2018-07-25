import { Model } from "objection";
import * as Knex from "knex";

import app from "./app";

const knexConfig = require("../knexfile");

const knex = Knex(knexConfig.development);
Model.knex(knex);

app.listen(3030);
console.log("Server running on port 3030");
