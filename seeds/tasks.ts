import * as Knex from "knex";
import * as Argon2 from "argon2";

exports.seed = function(knex: Knex): PromiseLike<any> {
    return knex("users")
        .del()
        .then(() => {
            return Argon2.hash("super secret");
        })
        .then(hash => {
            // Inserts seed entries
            return knex("users").insert([
                {
                    id: 1,
                    username: "test_user_1",
                    password: hash,
                    createdAt: new Date()
                },
                {
                    id: 2,
                    username: "test_user_2",
                    password: hash,
                    createdAt: new Date()
                }
            ]);
        });
};
