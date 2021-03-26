const socket = io();


class Game {
    /**
     * @constructor
     */
    constructor() {
        // Handle errors
        socket.on('error', (error) => {
            this.reportError(error);
        });

        // Handle join events
        socket.on('joined', (data) => {
            this.gameId = data.gameId;
            this.gameName = data.name;
            this.loadGame();
        });

        // Handle player list update
        socket.on('players', (players) => {
            this.displayPlayers(players);
        });
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
     * Render list of players
     * @param {Array} players Array of players
     * @param {string} players.username Username of player
     * @param {number} players.score Players score
     */
    displayPlayers(players) {
        // Loop through appending player row to content
        let players_content = "";
        for (let i = 0; i < players.length; i += 1) {
            players_content += `<tr><td>${players[i].username}</td><td>${players[i].score}</td></tr>`
        }
        $("#info_players").html(players_content)
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

    /**
     * Initialise game in DOM
     */
    loadGame() {
        $("#start").removeClass('active').addClass('inactive');
        $("#main").removeClass('inactive').addClass('active');
        $("#info_id").text(this.gameId);
        $("#info_name").text(this.gameName);
    }

}

const game = new Game();
$(document).ready(() => {
    $("#create").on('click', () => {
        game.createGame($("#username").val(), $("#game_name").val());
    });
    $("#join").on('click', () => {
        game.joinGame($("#join_username").val(), $("#join_id").val());
    })
})
