import { CommonEnum as constants } from "../../common/enums/common";
import timeSeries from "../../timeSeries";
import {DatabaseRoutes as dbRoutes} from "../../common/enums/databaseRoutes";
import cacheManager from "../../cacheManager";

class ConsumerService {
    private channel;
    private responseMap;
    private replyQueue;
    private readonly cacheManager;

    constructor(channel, responseMap, replyQueue) {
        this.channel = channel;
        this.responseMap = responseMap;
        this.replyQueue = replyQueue;
        this.cacheManager = cacheManager();
    }

    private async routes(request: any) {
        let response: object = { status: 200, msg: 'ok' };

        switch (request.route) {
            case dbRoutes.CREATE_DEVICE:
                await this.cacheManager.create(request.data);
                break;
            case dbRoutes.INSERT_MANY_DEVICES:
                await this.cacheManager.insertMany(request.data);
                break;
            case constants.TIME_SERIES:
                await this.cacheManager.checked(request.data);
                await timeSeries(request.data);
                break;
            default:
                response = { error: 'Unknown method' };
        }

        return response;
    }

    async consume() {
        const { queue } = await this.channel.assertQueue(this.replyQueue, { durable: true });

        return await this.channel.consume(queue, async (msg: any) => {
            if (msg) {
                const parsedMessage = JSON.parse(msg.content.toString());
                const correlationId = msg.properties.correlationId;

                if (this.responseMap.has(correlationId)) {
                    const { resolve } = this.responseMap.get(correlationId);
                    resolve(parsedMessage.data);
                    this.responseMap.delete(correlationId);
                }

                this.channel.ack(msg);

                this.channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(await this.routes(parsedMessage))),
                    { correlationId: msg.properties.correlationId }
                );
            }
        }, { noAck: false });
    }
}


export default (channel, responseMap, replyQueue) => {
    return new ConsumerService(channel, responseMap, replyQueue);
}