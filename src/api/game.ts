import {Request, Response, Router} from 'express';

const route = Router();
export default (app: Router):void=> {
    app.use('/', route);
}
