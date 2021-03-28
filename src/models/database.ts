/**
 * @todo Clean up return types for insertCards
 * @todo Optimise fetchCards by splitting current_cards into array of red card ID's and perk ID's and using separately in union
 */
import * as mysql from 'mysql2/promise';
import config from '../config';
import {FieldPacket, OkPacket, ResultSetHeader, RowDataPacket} from "mysql2";

const parseSQL = (array) => {
    return JSON.parse(JSON.stringify(array[0]))
}

class Database {
    private connection: mysql.Pool;

    constructor() {
        this.connection = mysql.createPool({
            host: config.database.hostname,
            user: config.database.username,
            database: config.database.name,
            password: config.database.password
        });
    }

    /**
     * Fetch red cards from database to deal to players
     * @param {number} players Number of players who need red cards
     * @param {array<string>} current_cards IDs of cards already used
     */
    public async fetchRedCards(players: number, current_cards: Array<string> = []): Promise<Array<Record<string, never>>> {
        const result = await this.connection.query(`SELECT *
                                                    FROM cards
                                                    WHERE id not in (?)
                                                      and type = 0
                                                    LIMIT ?`, [current_cards.join(), 3 * players]);
        return parseSQL(result);
    }

    /**
     * Fetch red cards from database to deal to players
     * @param {number} players Number of players who need white cards
     * @param {array<string>} current_cards IDs white cards already used
     */
    public async fetchWhiteCards(players: number, current_cards: Array<string> = []): Promise<Array<Record<string, never>>> {
        const result = await this.connection.query(`SELECT *
                                                    FROM cards
                                                    WHERE id not in (?)
                                                      and type = 1
                                                    LIMIT ?`, [current_cards.join(), 4 * players]);
        return parseSQL(result);
    }

    /**
     * Insert a card into database
     * @param {string} type Card type, either "red" or "white"
     * @param {string} content Card content in markdown or plaintext
     */
    public async insertCards(type: string, content: string): Promise<[(RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader) | FieldPacket[]] | boolean> {
        // If card is red, type = 0, otherwise card is white, so type = 1
        const card_type = type === 'red' ? 0 : 1
        try {
            const result = await this.connection.query(`INSERT INTO cards(type, content)
                                                        VALUES (?, ?)`, [card_type, content]);
            return result[0]['insertId'];
        } catch (e) {
            return false;
        }

    }
}

export default Database;
