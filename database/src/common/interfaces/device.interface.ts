import {Document} from "mongoose";
import {DeviceStatus} from "../enums/deviceActivity";

export interface IDevice extends Document {
    id?: string;
    name: string;
    status: DeviceStatus;
    createdAt?: Date;
    updatedAt?: Date;
}