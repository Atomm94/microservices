import { Schema, model } from 'mongoose';
import { IAdmin } from "../common/interfaces/admin.interface";

const AdminSchema = new Schema<IAdmin>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


const Admin = model('Admin', AdminSchema);
export default Admin;