import Services from "../../services";
import { AdminRoutes as adminRoutes } from '../../common/enums/adminRoutes';
import { DeviceRoutes as deviceRoutes } from '../../common/enums/deviceRoutes';
import {DB_QUEUE, MANAGER_QUEUE} from "../configs";
import connectRabbitMQ from "../index";
import {responseHandler} from "../../common/helpers/responseHandler";
import cacheManager from "../../cacheManager";

class ConsumerService {

    private dbQueue: string;
    private services;
    private managerQueue;
    private cacheManager;

    constructor(private channel: any, private readonly queue: string) {
        this.queue = queue
        this.channel = channel
        this.dbQueue = DB_QUEUE;
        this.managerQueue = MANAGER_QUEUE;
        this.services = Services;
        this.cacheManager = cacheManager();
    }

    private async connectToDb(request: any) {
        const { adminServices, deviceServices } = this.services;
        let response: any = { status: 200, msg: 'ok' };

        switch (request.route) {
            case adminRoutes.GET_ALL_ADMINS:
                response = await adminServices.getAll();
                break;
            case adminRoutes.GET_ONE_ADMIN:
                response = await adminServices.getOne(request.data);
                break;
            case adminRoutes.CREATE_ADMIN:
                response = await adminServices.create(request.data);
                break;
            case adminRoutes.UPDATE_ADMIN:
                response = await adminServices.update(request.data);
                break;
            case adminRoutes.REMOVE_ADMIN:
                response = await adminServices.remove(request.data);
                break;
            case deviceRoutes.CREATE_DEVICE:
                connectRabbitMQ.produce(
                    this.managerQueue,
                    deviceRoutes.CREATE_DEVICE,
                    await deviceServices.create(request.data)
                );
                break;
            case deviceRoutes.INSERT_MANY_DEVICES:
                connectRabbitMQ.produce(
                    this.managerQueue,
                    deviceRoutes.INSERT_MANY_DEVICES,
                    await deviceServices.insertMany(request.data)
                );
                break;
            case deviceRoutes.UPDATE_MANY_DEVICES:
                await deviceServices.updateMany(request.data);
                break;
            case deviceRoutes.GET_ALL_DEVICES:
                response = await deviceServices.get();
                break;
            case deviceRoutes.GET_ONE_DEVICE:
                response = responseHandler(await this.cacheManager.getOne(request.data));

                if (!response) {
                    response = await deviceServices.getOne(request.data);
                    break;
                }

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

                    this.channel.ack(msg);

                    const { content } = msg;

                    const request = JSON.parse(content.toString());

                    this.channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(await this.connectToDb(request))),
                        { correlationId: msg.properties.correlationId }
                    );
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