import {Document} from "mongoose";

export interface IAdmin extends Document {
    id?: string;
    name: string;
    username: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}