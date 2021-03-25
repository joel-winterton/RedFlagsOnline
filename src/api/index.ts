import {Router} from 'express';
import game from './game';

export default (): Router => {
    const app = Router();
    game(app);
    return app;
}
