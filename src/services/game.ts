/**
 * @todo
 */
interface Card {
    cardId: number,
    cardText: string,
}



interface Players {
    username: string,
    score: number,
}

export default class Game {
    private id: string;
    private readonly players: Players[];
    public readonly name: string;
    // Fix object declaration
    private cards: {username:Card};

    constructor(id: string, name: string) {
        this.id = id;
        this.players = [];
        this.name = name;
    }

    /**
     * Adds a new player object to the game object
     * @param {string} username - Username of user
     * @returns {boolean} - Success of adding user
     */
    joinGame(username: string): boolean {
        this.players.push({username: username, score: 0})
        return true;
    }

    /**
     * Returns the array of players
     * @returns {Players} - Array of
     */
    listPlayers(): Players[] {
        return this.players;
    }
}
