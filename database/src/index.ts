import dotenv from 'dotenv';
import connectDB from "./configs";
import connectRabbitMQ from "./messageBroker";
import timeSeries from "./timeSeries";

dotenv.config();

(async () => {
    await connectDB();
    await connectRabbitMQ.connect();

    const deviceId = '66f3c36766e5c867510b5d16';
    const deviceName = 'name1';
    const status = 'inactive';

    process.on('SIGINT', async () => {
        console.log('database shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
