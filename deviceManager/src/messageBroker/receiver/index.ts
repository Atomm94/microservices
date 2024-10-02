import {RBMQ_DB_QUEUE} from "../configs";
import { CommonEnum as constants } from "../../common/enums/common";

export const consume = async(channel, responseMap, replyQueue) => {
    const { queue } = await channel.assertQueue(replyQueue, { durable: true });
    const { queue: dbQueue } = await channel.assertQueue(RBMQ_DB_QUEUE, { durable: true });

    return await channel.consume(queue, (msg: any) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;

            if (responseMap.has(correlationId)) {
                const { resolve } = responseMap.get(correlationId);
                resolve(data);
                responseMap.delete(correlationId);
            }

            const { route } = data;

            if (route === constants.TIME_SERIES) {
                channel.sendToQueue(dbQueue,
                    Buffer.from(JSON.stringify(data)),
                    { correlationId: correlationId });
            }

            channel.ack(msg);
        }
    }, { noAck: false });
}