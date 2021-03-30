/**
 * @todo Fix white card selection logic (maximum of two cards can be selected)
 */
const socket = io();


class Game {
    constructor() {
        this.selected_white = [];
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
            // Remove start button
            $("#process_start").remove();
            // If player is the single no cards are dealt to them
            if (data.single) {
                $("#info_prompt").text(`You're the single person for this round!`)
            } else {
                $("#info_prompt").text(`Select two `)
                this.white_cards = data.white_cards;
                this.red_cards = data.red_cards;
                for (let i = 0; i < data.white_cards.length; i += 1) {
                    $("#info_white_cards").append(`<div class="col-md-3 white card" data-id="${data.white_cards[i].id}"><span>${data.white_cards[i].content}</span></div>`);
                }
                for (let j = 0; j < data.red_cards.length; j += 1) {
                    $("#info_red_cards").append(`<div class="col-md-4 red card" data-id="${data.red_cards[j].id}"><span>${data.red_cards[j].content}</span></div>`);
                }
            }
            // Show the send card button
            $("#process_send").show();
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
        // Set username
        this.username = username;
        // Emit join request
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

    selectCard(type, id) {
        if (type === 'red') {
            this.selected_red = id;
        } else if (type === 'white') {
            this.selected_white.push(id);
        }

    }

    removeCard(id) {
        const index = this.selected_white.indexOf(id);
        this.selected_white.splice(index, 1);
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
    });
    $("#process_copy").on('click', () => {
        game.copyGameID();
    });

    $(document).on('click', '.white', function () {
        const card = $(this);
        // If user is deselecting, remove card
        if (card.hasClass('selected')) {
            card.removeClass('selected');
            game.removeCard(card.data('id'));
        }

        // If there is space to select another card
        if (game.selected_white.length < 2) {
            card.toggleClass('selected');
            game.selectCard('white', card.data('id'));
        }
    });
    $(document).on('click', '.red', function () {
        const card = $(this);
        // Remove all other selected elements
        $(`.red[data-id!=${card.data('id')}]`).removeClass('selected');
        // Select red card
        card.addClass('selected');
        // Add red card to game object
        game.selectCard('red', card.data('id'));
    });
});
