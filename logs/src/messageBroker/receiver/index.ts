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

            channel.ack(msg);
        }
    }, { noAck: false });
}