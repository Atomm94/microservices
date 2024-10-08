import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";
import {logger} from "./timer";
import checkDevicesList from "./common/helpers/checkDevicesList";

dotenv.config();

(async () => {
    await connectRabbitMQ.connect();
    await logger().startLogging();

    process.on('SIGINT', async () => {
        console.log('logs shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
