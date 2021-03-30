import Database from '../models/database';

interface Card {
    cardId: number,
    cardText: string,
    cardType: string,
}


interface Players {
    username: string,
    score: number,
    id: string
}

export default class Game extends Database {
    private id: string;
    private readonly players: Players[];
    public readonly name: string;
    private readonly usersCards: { user: { red_card: Record<string, never>, white_card: Record<string, never> } } | Record<string, never>;
    private redCards: [string];
    private whiteCards: [string];
    public singlePlayer: Players;

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.players = [];
        this.name = name;
        this.usersCards = {};
    }

    /**
     * Adds a new player object to the game object
     * @param {string} username - Username of user
     * @param {string} socket_id - Socket.io ID
     * @returns {boolean} - Success of adding user
     */
    joinGame(username: string, socket_id: string): boolean {
        this.players.push({username: username, score: 0, id: socket_id})
        return true;
    }

    /**
     * Returns the array of players
     * @returns {Players} - Array of
     */
    listPlayers(): Players[] {
        return this.players;
    }

    /**
     * Deal cards to users
     */

    async dealCards() {
        // Since "Single" player doesn't get any cards
        const players = this.players.length - 1;

        // Fetch white and red cards
        const red_cards = await this.fetchRedCards(players);
        const white_cards = await this.fetchWhiteCards(players);
        // Loop through players and deal cards to none single players
        for (let i = 0; i < this.players.length; i += 1) {
            if (this.players[i].username !== this.singlePlayer.username) {

                // Assign cards
                this.usersCards[this.players[i].id] = {
                    red_cards: red_cards.slice(0, 3),
                    white_cards: white_cards.slice(0, 4)
                };

                // Remove assigned cards from cards that can be dealt
                white_cards.splice(0, 4);
                red_cards.splice(0, 3);
            }
        }
    }

    async startGame(dealCallback: (socketId, message) => void): Promise<void> {
        // Set initial single player
        this.singlePlayer = this.players[0];
        // Assign cards to users
        await this.dealCards();
        // Call socket callback for dealing cards
        for (const [socketId, cards] of Object.entries(this.usersCards)) {
            dealCallback(socketId, cards);
        }
        dealCallback(this.singlePlayer.id, {single: true});
    }
}
