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
        const updatedData = data.map(el => {
            return Device.updateOne({_id: el._id}, {$set: {status: el.status, lastPingTime: el.lastPingTime}})
        })

        return await Promise.all(updatedData);
    }

    get = async () => {
        return responseHandler(await Device.find({}, 'name status lastPingTime'))
    }

    getOne = async (id: string) => {
        return responseHandler(await Device.findOne({ id }, 'name status lastPingTime'))
    }
}

export const deviceServices = new DeviceService();