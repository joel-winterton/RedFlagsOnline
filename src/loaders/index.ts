import expressLoader from './express';
import socketLoader from './socket';

export default async ({expressApp, httpServer}) => {
    await expressLoader({app: expressApp});
    await socketLoader({http: httpServer});
    console.log('Express initialised')
}
