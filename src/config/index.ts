import * as dotenv from 'dotenv';
// Parse .env file and assign it to environment
dotenv.config({path: `${__dirname}/.env`});
export default {
    // Port for express app to listen on
    port: process.env.EXPRESS_PORT,

    // Prefix to access API routes from web
    api: {
        prefix: '/api'
    },
    // Database connection details
    database: {
        hostname: process.env.DB_HOST,
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
}
