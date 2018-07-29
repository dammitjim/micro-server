import * as Knex from "knex";

const USERS_TABLE_NAME = "users";
const TASKS_TABLE_NAME = "tasks";

exports.up = function(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.createTable(USERS_TABLE_NAME, t => {
            t.increments("id")
                .unsigned()
                .primary();
            t.string("username").notNullable();
            t.string("password").notNullable();
            t.dateTime("createdAt").notNullable();
            t.dateTime("lastLoggedIn").nullable();
        })
    ]);
};

exports.down = function(knex: Knex): Promise<any> {
    return Promise.all([knex.schema.dropTable(USERS_TABLE_NAME)]);
};
