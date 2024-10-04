import dotenv from 'dotenv';
import connectRabbitMQ from "./messageBroker";
import cacheManager from "./cacheManager";

dotenv.config();

(async () => {
    await connectRabbitMQ.connect();

    const data = await cacheManager().get();

    //console.log(data)

    if (!data) {
        // const b = await connectRabbitMQ.produce('get');
        // console.log(b)
    }

    process.on('SIGINT', async () => {
        console.log('device manager shutting down...');
        await connectRabbitMQ.connection.close();
        process.exit(0);
    });
})()
