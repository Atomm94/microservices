import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";
import {logger} from "./timer";

dotenv.config();

const devices = [
    { name: 'device1', status: 'active' },
    { name: 'device2', status: 'active' },
    { name: 'device3', status: 'active' },
    { name: 'device4', status: 'active' },
    { name: 'device5', status: 'active' },
];

(async () => {
    await connectRabbitMQ.connect();
    await logger(devices).startLogging();

    process.on('SIGINT', async () => {
        console.log('logs shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
