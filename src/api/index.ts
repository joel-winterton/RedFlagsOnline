import {Router} from 'express';
import game from './game';

export default () => {
    const app = Router();
    game(app);
    return app;
}
