import Admin from "../models/admins";
import {IAdmin} from "../common/interfaces/admin.interface";
import {hashPassword} from "../common/helpers/auth";
import {responseHandler} from "../common/helpers/responseHandler";
import {ResponseMessage as message} from "../common/enums/responseMessages";

export class AdminService {
    getAll = async () => {
        return responseHandler(await Admin.find<IAdmin>({}));
    }

    getOne = async (id: string) => {
        const admin = await Admin.findById<IAdmin>(id);
        if (!admin) {
            return responseHandler('admin is not found', message.failed, 404)
        }

        return responseHandler(admin);
    }

    create = async (data: any) => {
        const username: string = data.username;
        const password: string = data.password;
        data.password = await hashPassword(password);

        const admin = await Admin.findOne<IAdmin>({ username });

        if (admin) {
            return responseHandler('username already exists', message.failed, 409)
        }

        return responseHandler(await Admin.create<IAdmin>(data))
    }

    update = async (data: any) => {
        const id = data.id;
        const updateData = {...data, id}
        updateData.password = await hashPassword(updateData.password);
        const admin = await Admin.findByIdAndUpdate<IAdmin>({_id: id}, updateData, {new: true})
        if (!admin) {
            return responseHandler('admin is not found', message.failed, 404)
        }

        return responseHandler(admin);
    }

    remove = async (id: string) => {
        const admin = await Admin.findByIdAndDelete<IAdmin>(id)
        if (!admin) {
            return responseHandler('admin is not found', message.failed, 404)
        }

        return responseHandler(admin);
    }
}

export const adminServices = new AdminService();