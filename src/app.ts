const express = require('express');

import config from './config';

async function startServer() {
    const app = express();
    await require('./loaders').default({expressApp: app});
    app.listen(config.port, () => {
        console.log(`Server listening at: http://localhost:${config.port}`)
    })
}

startServer();

