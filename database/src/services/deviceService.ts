import Device from "../models/devices";
import {responseHandler} from "../common/helpers/responseHandler";

export class DeviceService {
    create = async (data: any) => {
        return responseHandler(await Device.create(data))
    }

    insertMany = async (data: any) => {
        return responseHandler(await Device.insertMany(data));
    }

    updateMany = async (data: any) => {
        const { id, status } = data;

        return responseHandler(await Device.updateMany(
            { _id: { $in: id } },
            { $set: { status } }
        ))
    }

    get = async () => {
        return responseHandler(await Device.find({}, 'name status lastPingTime'))
    }

    getOne = async (id: string) => {
        return responseHandler(await Device.findOne({ id }, 'name status lastPingTime'))
    }
}

export const deviceServices = new DeviceService();