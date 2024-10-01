import mongoose from 'mongoose';
import config from "./db.configs";


export default async () => {
    try {
        const uri = config.uri as string;
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
