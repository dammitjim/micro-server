import { Model } from "objection";

export default class User extends Model {
    readonly id!: number;
    username!: string;
    password!: string;
    createdAt!: Date;
    lastLoggedIn?: Date;

    static tableName = "users";
}