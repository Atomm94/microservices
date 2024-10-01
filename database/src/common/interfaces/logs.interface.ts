import {Document, ObjectId} from "mongoose";

export interface ILogs extends Document {
    id?: string;
    deviceId: ObjectId;
    deviceName: string;
    createdAt?: Date;
    updatedAt?: Date;
}