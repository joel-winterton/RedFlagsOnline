import Game from './game';


export default class GameManager {
    public games: { [gameID: string]: Game };

    constructor(){
        this.games = {};
    }
    /**
     * Generates a random ID for game
     * @returns {string} Unique random ID
     */
    private generateID(): string {
        const id = Math.random().toString(36).substring(7);
        if (id in this.games) {
            return this.generateID();
        } else {
            return id;
        }
    }

    /**
     * Add a new game object to the list of games
     * @returns {string} The ID of the game
     */
    public generateGame(name:string): string {
        const id = this.generateID();
        this.games[id] = new Game(id, name);
        return id;
    }
}
