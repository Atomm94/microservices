import Device from "../models/devices";

export class DeviceService {
    updateMany = async (data: any) => {
        const { id, status } = data;
        return Device.updateMany(
            { _id: { $in: id } },
            { $set: { status } }
        )
    }
}

export const deviceServices = new DeviceService();