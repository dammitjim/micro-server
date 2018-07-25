import { Model } from "objection";

export default class Task extends Model {
    readonly id!: number;
    title!: string;
    text?: string;
    createdAt!: Date;
    completedAt?: Date;
    completed!: boolean;
    static tableName = "tasks";
}
