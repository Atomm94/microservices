import client, { Connection, Channel } from "amqplib";
import {rmqhost, DB_QUEUE, ADMIN_QUEUE} from "./configs";
import consumerService from './receiver/index';
import {randomUUID} from "crypto";
import {sendToQueue} from "./sender";

class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
    responseMap = new Map();
    generatedQueue = DB_QUEUE+randomUUID();

    async connect() {
        if (this.connected && this.channel) return;
        try {
            console.log(`Connecting to Rabbit-MQ Server`);

            this.connection = await client.connect(
                `amqp://${rmqhost}:5672`
            );

            console.log(`Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            console.log(`Created RabbitMQ Channel successfully`);

            await consumerService(this.channel, DB_QUEUE).consume();
            await consumerService(this.channel, this.generatedQueue).consume();

            this.connected = true;

        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }


    async produce(route, data = {}) {
        const args = {
            channel: this.channel,
            sendTo: ADMIN_QUEUE,
            replyTo: this.generatedQueue,
            responseMap: this.responseMap,
            route,
            data
        };

        return await sendToQueue(args);
    }

}

const mqConnection = new RabbitMQConnection();

export default mqConnection;