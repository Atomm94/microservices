import { Schema, model } from 'mongoose';
import {ILogs} from "../common/interfaces/logs.interface";

const LogsSchema = new Schema<ILogs>(
    {
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        deviceName: String,
    },
    {
        timestamps: true,
    }
);


const Logs = model('Logs', LogsSchema);
export default Logs;