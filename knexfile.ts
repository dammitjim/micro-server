// Update with your config settings.

module.exports = {
    development: {
        client: "postgresql",
        connection: {
            database: "micro_dev",
            user: "postgres"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
};
