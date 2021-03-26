const socket = io();


class Game {
    /**
     * @constructor
     */
    constructor() {
        // Handle errors
        socket.on('error', (error) => {
            this.reportError(error);
        })

        // Handle join events
        socket.on('joined', (data) => {
            console.log(`Joined "${data.name}"`);
            this.gameId = data.gameId;
            this.game_name = data.name;

        })
    }

    /**
     * Report error to DOM
     * @param {string} error - Error text to add to DOM
     * @des
     */
    reportError(error) {
        $("#error").text(error);
    }


    /**
     * Create and join a game
     * @param {string} username
     * @param {string} game_name
     */
    createGame(username, game_name) {
        // Set username and game name
        this.username = username;

        // Create game
        socket.emit('create', game_name);

        // Wait for server to confirm creation then join game
        socket.on('created', (gameId) => {
            this.joinGame(this.username, gameId);
        });
    }

    /**
     * Join game given ID
     * @param {string} username Desired username
     * @param {string} game_id ID of game to join
     */
    joinGame(username, game_id) {
        socket.emit('join', {username, game_id});
    }
}

const game = new Game();
$(document).ready(() => {
    $("#create").on('click', () => {
        game.createGame($("#username").val(), $("#game_name").val());
    });
    $("#join").on('click', () => {
        game.joinGame($("#join_username").val(), $("#join_id"));
    })
})
