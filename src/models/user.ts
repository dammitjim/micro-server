import { Model } from "objection";

export default class User extends Model {
    public static tableName = "users";
    public readonly id!: number;
    public username!: string;
    public password!: string;
    public createdAt!: Date;
    public lastLoggedIn?: Date;
}
