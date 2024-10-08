import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";
import {cronjob} from "./cron";

dotenv.config();

(async () => {
    await connectRabbitMQ.connect();
    await cronjob.start();

    process.on('SIGINT', async () => {
        console.log('device manager shutting down...');
        await cronjob.stop();
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
