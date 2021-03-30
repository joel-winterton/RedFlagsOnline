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

        // Handle cards being dealt
        socket.on('deal', (data) => {
            // If player is the single no cards are dealt to them
            if (data.single) {
                $("#info_cards").text(`You're the single person for this round!`)
            } else {
                this.white_cards = data.white_cards;
                this.red_cards = data.red_cards;
                for (let i = 0; i < data.white_cards.length; i += 1) {
                    $("#info_cards").append(`<strong>White card</strong> ${data.white_cards[i].content}<br>`)
                }
                for (let j = 0; j < data.red_cards.length; j += 1) {
                    $("#info_cards").append(`<strong>Red card</strong> ${data.red_cards[j].content}<br>`);
                }
            }
        })

    }

    /**
     * Request game be started
     */
    startGame() {
        socket.emit('start');
    }

    /**
     * Report error to DOM
     * @param {string} error - Error text to add to DOM
     *
     */
    reportError(error) {
        $("#error").append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Error: </strong> ${error}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`);
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
            players_content += `<li><strong>${players[i].username}</strong> (${players[i].score} points)</li>`;
        }
        $("#info_players").html(players_content);
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
        $("#info_id").val(this.gameId);
        $("#info_name").text(this.gameName);
    }

    /**
     * Copy game ID to the clipboard
     */
    copyGameID() {
        const text = $("#info_id");
        const button = $("#process_copy")
        // Select text field
        text[0].select();
        text[0].setSelectionRange(0, 99999); // For mobile devices
        // Copy text
        document.execCommand('copy');
        button.html('Copied');
        setTimeout(() => {
            button.html('Copy');
        }, 3000);
    }

}

const game = new Game();
$(document).ready(() => {
    $("#process_create").on('click', () => {
        game.createGame($("#username").val(), $("#game_name").val());
    });
    $("#process_join").on('click', () => {
        game.joinGame($("#join_username").val(), $("#join_id").val());
    });
    $("#process_start").on('click', () => {
        game.startGame();
    })
    $("#process_copy").on('click', () => {
        game.copyGameID();
    })

})
