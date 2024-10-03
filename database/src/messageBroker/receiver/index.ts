import Services from "../../services";
import { AdminRoutes as adminRoutes } from '../../common/enums/adminRoutes';
import { DeviceRoutes as deviceRoutes } from '../../common/enums/deviceRoutes';
import {DB_QUEUE} from "../configs";

class ConsumerService {

    private dbQueue: string;
    private services;

    constructor(private channel: any, private readonly queue: string) {
        this.queue = queue
        this.channel = channel
        this.dbQueue = DB_QUEUE;
        this.services = Services;
    }

    private async connectToDb(request: any) {
        const { adminServices, deviceServices } = this.services;
        let response;

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
            case deviceRoutes.CREATE:
                response = await deviceServices.create(request.data);
                break;
            case deviceRoutes.INSERT_MANY:
                response = await deviceServices.insertMany(request.data);
                break;
            case deviceRoutes.UPDATE_MANY:
                response = await deviceServices.updateMany(request.data);
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
                    const request = JSON.parse(content.toString());

                    this.channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(await this.connectToDb(request))),
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