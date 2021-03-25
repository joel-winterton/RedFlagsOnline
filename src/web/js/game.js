const socket = io();


class Game {
    create() {
        socket.emit('create','username');
    }
    getGame(){
        socket.emit('get')
    }
}

const game = new Game();
game.create();
