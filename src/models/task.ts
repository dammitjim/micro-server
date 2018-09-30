import { Model } from "objection";
import User from "./user";

export default class Task extends Model {
    static get relationMappings() {
        return {
            user: {
                join: {
                    from: "tasks.user_id",
                    to: "users.id",
                },
                modelClass: User,
                relation: Model.BelongsToOneRelation,
            },
        };
    }

    public static tableName = "tasks";
    public readonly id!: number;
    public title!: string;
    public text?: string;
    public createdAt!: Date;
    public completedAt?: Date;
    public completed!: boolean;
}
