import dotenv from 'dotenv';
import connectDB from "./configs";
import connectRabbitMQ from "./messageBroker";

dotenv.config();

(async () => {
    await connectDB();
    await connectRabbitMQ.connect();

    process.on('SIGINT', async () => {
        console.log('database shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
