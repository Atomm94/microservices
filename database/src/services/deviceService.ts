import Device from "../models/devices";

export class DeviceService {
    create = async (data: any) => {
        return await Device.create(data)
    }

    insertMany = async (data: any) => {
        return await Device.insertMany(data)
    }

    updateMany = async (data: any) => {
        const { id, status } = data;
        return await Device.updateMany(
            { _id: { $in: id } },
            { $set: { status } }
        )
    }
}

export const deviceServices = new DeviceService();