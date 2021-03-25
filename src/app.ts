const express = require('express');
import config from './config';
import {createServer} from 'http';
async function startServer() {
    const app = express();
    const http = createServer(app);
    await require('./loaders').default({expressApp: app, httpServer: http });
    http.listen(config.port, () => {
        console.log(`Server listening at: http://localhost:${config.port}`)
    })
}

startServer();

