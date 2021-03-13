import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from '../config';
import routes from '../api';
import path from 'path';

export default async ({app}: { app: express.Application }) => {

    // Static directories
    app.use(express.static(path.join(__dirname, '../web')));

    // Health check endpoints
    app.get('/status', (req, res) => {
        res.status(200).end();
    })

    // Show real origin IP since using a reverse proxy
    app.enable('trust proxy');

    // Body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    // Load API routes
    app.use(config.api.prefix, routes())

}
