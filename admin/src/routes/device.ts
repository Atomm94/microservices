import { Request, Response, Router } from 'express';
import rabbitService from '../messageBroker';
import { DbRoutes as dbRoutes } from "../common/enums/dbRoutes";

const device = Router();

device.get('/', async (req: Request, res: Response) => {
    const results: any = await rabbitService.produce(dbRoutes.GET_ALL);

    return res.status(results.status).send(results);
})

device.get('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.GET_ONE, id);

    return res.status(results.status).send(results);
})

device.post('/', async (req: Request, res: Response) => {
    const { body } = req;
    const results: any = await rabbitService.produce(dbRoutes.CREATE, body);

    return res.status(results.status).send(results);
})

device.put('/:id', async (req: Request, res: Response) => {
    const { body, params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.UPDATE, { id, ...body});

    return res.status(results.status).send(results);
})

device.delete('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.REMOVE, id);

    return res.status(results.status).send(results);
})

export { device };