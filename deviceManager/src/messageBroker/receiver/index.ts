import {RBMQ_DB_QUEUE} from "../configs";

export const consume = async(channel, responseMap, replyQueue) => {
    const { queue } = await channel.assertQueue(replyQueue, { durable: true });

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

            if (route === 'timeseries') {
                console.log('dddddddddd')
                channel.sendToQueue(
                    RBMQ_DB_QUEUE,
                    Buffer.from(JSON.stringify(data)),
                    { correlationId: msg.properties.correlationId }
                );
            }

            channel.ack(msg);
        }
    }, { noAck: false });
}