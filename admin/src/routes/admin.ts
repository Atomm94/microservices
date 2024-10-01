import { Request, Response, Router } from 'express';
import rabbitService from '../messageBroker';
import { DbRoutes as dbRoutes } from "../common/enums/dbRoutes";

const admin = Router();

admin.get('/', async (req: Request, res: Response) => {
    const results: any = await rabbitService.produce(dbRoutes.GET_ALL);

    return res.status(results.status).send(results);
})

admin.get('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.GET_ONE, id);

    return res.status(results.status).send(results);
})

admin.post('/', async (req: Request, res: Response) => {
    const { body } = req;
    const results: any = await rabbitService.produce(dbRoutes.CREATE, body);

    return res.status(results.status).send(results);
})

admin.put('/:id', async (req: Request, res: Response) => {
    const { body, params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.UPDATE, { id, ...body});

    return res.status(results.status).send(results);
})

admin.delete('/:id', async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const results: any = await rabbitService.produce(dbRoutes.REMOVE, id);

    return res.status(results.status).send(results);
})

export { admin };