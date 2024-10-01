import client, { Connection, Channel } from "amqplib";
import { randomUUID } from "crypto";

import {rmqhost, RBMQ_LOGS_QUEUE, RBMQ_MANAGER_QUEUE} from "./configs";
import {consume} from "./receiver";
import {sendToQueue} from "./sender";

class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
    responseMap = new Map();
    generatedQueue = RBMQ_LOGS_QUEUE+randomUUID();

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            console.log('Connecting to Rabbit-MQ Server');
            this.connection = await client.connect(
                `amqp://${rmqhost}:5672/`
            );

            console.log('Rabbit MQ Connection is ready');

            this.channel = await this.connection.createChannel();

            await consume(this.channel, this.responseMap, RBMQ_LOGS_QUEUE);
            //await consume(this.channel, this.responseMap, this.generatedQueue);
            console.log('Created RabbitMQ Channel successfully');
        } catch (error) {
            console.error(error);
            console.error('Not connected to MQ Server');
        }
    }

    async produce(route, data = {}) {
        try {
            const args = {
                channel: this.channel,
                responseMap: this.responseMap,
                sendTo: RBMQ_MANAGER_QUEUE,
                route,
                data
            };

            return await sendToQueue(args);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;