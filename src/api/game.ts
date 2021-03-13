import {Request, Response, Router} from 'express';

const route = Router();
export default (app: Router) => {
    app.use('/', route);
    route.post('/game/create', (req: Request, res: Response) => {
    })
}
