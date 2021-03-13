import * as mysql from 'mysql2/promise';
import config from '../config';

class Database {
    private connection: mysql.Pool;

    constructor() {
        this.connection = mysql.createPool({
            host: config.database.hostname,
            user: config.database.username,
            database: config.database.name,
            password: config.database.password
        })
    }

    async
}
