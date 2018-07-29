import { Model } from "objection";
import User from "./user";

export default class Task extends Model {
    readonly id!: number;
    title!: string;
    text?: string;
    createdAt!: Date;
    completedAt?: Date;
    completed!: boolean;

    static tableName = "tasks";

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "tasks.user_id",
                    to: "users.id"
                }
            }
        };
    }
}
