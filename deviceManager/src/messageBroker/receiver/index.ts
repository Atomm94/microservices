import {RBMQ_DB_QUEUE} from "../configs";
import { CommonEnum as constants } from "../../common/enums/common";
import timeSeries from "../../timeSeries";

export const consume = async(channel, responseMap, replyQueue) => {
    const { queue } = await channel.assertQueue(replyQueue, { durable: true });
    const { queue: dbQueue } = await channel.assertQueue(RBMQ_DB_QUEUE, { durable: true });

    return await channel.consume(queue, async (msg: any) => {
        if (msg) {
            const parsedMessage = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;

            if (responseMap.has(correlationId)) {
                const { resolve } = responseMap.get(correlationId);
                resolve(parsedMessage);
                responseMap.delete(correlationId);
            }

            const { route, data } = parsedMessage;

            if (route === constants.TIME_SERIES) {
                return await timeSeries(data)

                //
                // channel.sendToQueue(dbQueue,
                //     Buffer.from(JSON.stringify(parsedMessage)),
                //     { correlationId: correlationId });
            }

            channel.ack(msg);
        }
    }, { noAck: false });
}