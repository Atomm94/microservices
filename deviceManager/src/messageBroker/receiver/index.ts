import { CommonEnum as constants } from "../../common/enums/common";
import timeSeries from "../../timeSeries";
import {DatabaseRoutes as dbRoutes} from "../../common/enums/databaseRoutes";

class ConsumerService {
    private channel;
    private responseMap;
    private replyQueue;

    constructor(channel, responseMap, replyQueue) {
        this.channel = channel;
        this.responseMap = responseMap;
        this.replyQueue = replyQueue;
    }

    private async routes(request: any) {
        let response;

        // console.log('req')
        // console.log(request)

        switch (request.route) {
            case dbRoutes.CREATE:
                //response = await deviceServices.get();
                console.log(request.data);
                break;
            case dbRoutes.INSERT_MANY:
                //response = await deviceServices.get();
                console.log(request.data);
                break;
            case constants.TIME_SERIES:
                //response = await deviceServices.get();
                console.log(response);
                await timeSeries(request.data)
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
                    resolve(parsedMessage);
                    this.responseMap.delete(correlationId);
                }

                this.channel.ack(msg);

                console.log(msg.properties.replyTo)

                console.log('parssssssssss')
                console.log(parsedMessage)

                const obj = {a: 1, b:[2, 4]}

                this.channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(await this.routes(parsedMessage))),
                    { correlationId: msg.properties.correlationId }
                );

                // if (route === constants.TIME_SERIES) {
                //     return await timeSeries(data)
                //
                //     //
                //     // channel.sendToQueue(dbQueue,
                //     //     Buffer.from(JSON.stringify(parsedMessage)),
                //     //     { correlationId: correlationId });
                // }
            }
        }, { noAck: false });
    }
}


export default (channel, responseMap, replyQueue) => {
    return new ConsumerService(channel, responseMap, replyQueue);
}