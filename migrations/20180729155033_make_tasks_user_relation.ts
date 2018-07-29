import * as Knex from "knex";

const TASKS_TABLE_NAME = "tasks";

exports.up = function(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.table(TASKS_TABLE_NAME, t => {
            t.integer("user_id").references(`users.id`);
        })
    ]);
};

exports.down = function(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.table(TASKS_TABLE_NAME, t => {
            t.dropColumn("user_id");
        })
    ]);
};
