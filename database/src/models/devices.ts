import { Schema, model } from 'mongoose';
import {IDevice} from "../common/interfaces/device.interface";
import {DeviceStatus} from "../common/enums/deviceActivity";

const DeviceSchema = new Schema<IDevice>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(DeviceStatus),
            default: DeviceStatus.Active
        },
        lastPingTime: String,
    },
    {
        timestamps: true,
    }
);


const Device = model('Device', DeviceSchema);
export default Device;