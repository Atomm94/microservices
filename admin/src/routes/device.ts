import { Request, Response, Router } from 'express';
import rabbitService from '../messageBroker';
import rabbitRoutes from "../common/enums";
import {DB_QUEUE, MANAGER_QUEUE} from "../messageBroker/configs";

const device = Router();
const { deviceRoutes } = rabbitRoutes;

// device.put('/', async (req: Request, res: Response) => {
//     const data: any = ['66fd4b8c3af75991986f2d5b', '66fd4b8c3af75991986f2d5c', '66fd4b8c3af75991986f2d6e'];
//
//     // for (let i = 0; i < 100000; i++) {
//     //     data.push({name: `device${Math.random() * 6}`, lastPingTime: new Date().toISOString()});
//     // }
//
//     const results: any = await rabbitService.produce(deviceRoutes.UPDATE_MANY, data);
//
//     return res.status(results.status).send(results);
// })

// device.get('/', async (req: Request, res: Response) => {
//     const { body } = req;
//
//     const results: any = await rabbitService.produce(deviceRoutes.CREATE, body);
//
//     return res.status(results.status).send(results);
// })

device.post('/bulk', async (req: Request, res: Response) => {
    const data: any = [];

    for (let i = 0; i < 10; i++) {
        data.push({name: `device${Math.random() * 6}`, lastPingTime: new Date().toLocaleString()});
    }

    const results: any = await rabbitService.produce(DB_QUEUE, deviceRoutes.INSERT_MANY, data);

    return res.status(results.status).send(results);
})

// device.post('/', async (req: Request, res: Response) => {
//     const { body } = req;
//
//     const results: any = await rabbitService.produce(MANAGER_QUEUE, deviceRoutes.CREATE, body);
//
//     return res.status(results.status).send(results);
// })

export { device };