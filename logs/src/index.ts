import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";
import {logger} from "./timer";

dotenv.config();

const devices = [
    { id: '66f3c36766e5c867510b5d16', name: 'device1'},
    { id: '66f3c36766e5c867510b5d15', name: 'device2'},
    { id: '66f3c36766e5c867510b5d11', name: 'device3'},
    { id: '66f3c36766e5c867510b5d19', name: 'device4'},
    { id: '66f3c36766e5c867510b5d14', name: 'device5'},
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
