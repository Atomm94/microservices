import {adminServices} from "../../services";
import { AdminRoutes as adminRoutes } from '../../common/enums/adminRoutes';
import timeSeries from "../../timeSeries";

class ConsumerService {

    constructor(private channel: any, private readonly queue: string) {
        this.queue = queue
        this.channel = channel
    }

    private async connectToDb(content: any) {
        const request = JSON.parse(content.toString());
        let response;

        console.log(request)

        switch (request.route) {
            case adminRoutes.GET_ALL:
                response = await adminServices.getAll();
                break;
            case adminRoutes.GET_ONE:
                response = await adminServices.getOne(request.data);
                break;
            case adminRoutes.CREATE:
                response = await adminServices.create(request.data);
                break;
            case adminRoutes.UPDATE:
                response = await adminServices.update(request.data);
                break;
            case adminRoutes.REMOVE:
                response = await adminServices.remove(request.data);
                break;
            case 'timeseries':
                console.log('tm')
                console.log(request.data)
                await timeSeries(request.data);
                break;
            default:
                response = { error: 'Unknown method' };
        }

        return response;
    }

    async consume() {
        const { queue } = await this.channel.assertQueue(this.queue, { durable: true });

        await this.channel.prefetch(1);

        return await this.channel.consume(
            queue,
            async (msg: any) => {
                {
                    if (!msg) {
                        return console.error(`Invalid incoming message`);
                    }

                    const { content } = msg;

                    console.log('cccc')
                    console.log(content)

                    this.channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(await this.connectToDb(content))),
                        { correlationId: msg.properties.correlationId }
                    );

                    this.channel.ack(msg);
                }
            },
            {
                noAck: false,
            }
        );
    }
}

export default (channel, queue) => {
    return new ConsumerService(channel, queue);
};