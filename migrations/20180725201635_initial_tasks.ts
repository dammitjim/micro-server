import * as Knex from "knex";

const TASKS_TABLE_NAME = "tasks";

exports.up = function(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.createTable(TASKS_TABLE_NAME, t => {
            t.increments("id")
                .unsigned()
                .primary();
            t.string("title").notNullable();
            t.text("text").nullable();
            t.dateTime("createdAt").notNullable();
            t.dateTime("completedAt").nullable();
            t.boolean("completed")
                .notNullable()
                .defaultTo(false);
        })
    ]);
};

exports.down = function(knex: Knex): Promise<any> {
    return Promise.all([knex.schema.dropTable(TASKS_TABLE_NAME)]);
};
