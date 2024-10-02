import { Request, Response, Router } from 'express';
import rabbitService from '../messageBroker';
import rabbitRoutes from "../common/enums";

const device = Router();
const { deviceRoutes } = rabbitRoutes;

device.put('/', async (req: Request, res: Response) => {
    const data: any = ['66fd4b8c3af75991986f2d5b', '66fd4b8c3af75991986f2d5c', '66fd4b8c3af75991986f2d6e'];

    // for (let i = 0; i < 100000; i++) {
    //     data.push({name: `device${Math.random() * 6}`, lastPingTime: new Date().toISOString()});
    // }

    const results: any = await rabbitService.produce(deviceRoutes.UPDATE_MANY, data);

    return res.status(results.status).send(results);
})


export { device };