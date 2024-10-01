import { randomUUID } from "crypto";

export const sendToQueue = async (args) => {
    try {
        const { channel, responseMap, sendTo, route, data = {} } = args;

        const correlationId = randomUUID();
        const { queue } = await channel.assertQueue(sendTo, { durable: true });

        return new Promise((resolve) => {
            channel.sendToQueue(queue,
                Buffer.from(JSON.stringify({ route, data })),
                { correlationId: correlationId });

            responseMap.set(correlationId, { resolve });
        })

    } catch (error) {
        console.error(error);
        throw error;
    }
}