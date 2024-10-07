import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";

dotenv.config();

(async () => {
    await connectRabbitMQ.connect();

    process.on('SIGINT', async () => {
        console.log('device manager shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
