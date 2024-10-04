import { Request, Response, Router } from 'express';
import rabbitService from '../messageBroker';
import rabbitRoutes from "../common/enums";
import {DB_QUEUE} from "../messageBroker/configs";

const admin = Router();
const { adminRoutes } = rabbitRoutes;

admin.get('/', async (req: Request, res: Response) => {
    const results: any = await rabbitService.produce(DB_QUEUE, adminRoutes.GET_ALL);

    return res.status(results.status).send(results);
})

admin.get('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(DB_QUEUE, adminRoutes.GET_ONE, id);

    return res.status(results.status).send(results);
})

admin.post('/', async (req: Request, res: Response) => {
    const { body } = req;
    const results: any = await rabbitService.produce(DB_QUEUE, adminRoutes.CREATE, body);

    return res.status(results.status).send(results);
})

admin.put('/:id', async (req: Request, res: Response) => {
    const { body, params: { id } } = req;
    const results: any = await rabbitService.produce(DB_QUEUE, adminRoutes.UPDATE, { id, ...body});

    return res.status(results.status).send(results);
})

admin.delete('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(DB_QUEUE, adminRoutes.REMOVE, id);

    return res.status(results.status).send(results);
})

export { admin };