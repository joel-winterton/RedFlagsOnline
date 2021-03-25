import {Socket} from 'socket.io';
import GameManager from '../services/manager';

interface SocketIO extends Socket {
    username: string,
    gameId?: string,
}

const manager = new GameManager();
export default async (socket: SocketIO): Promise<void> => {
    socket.on('create', (username) => {
        const gameId = manager.generateGame();
        if (manager.games[gameId].joinGame(username)) {
            socket.gameId = gameId;
        }
    })
    socket.on('join', (username, gameId) => {
        try {

            // Add player to game object
            const game = manager.games[gameId];
            game.joinGame(username);
            socket.gameId = gameId;

            // Add player to game socket
            socket.join(gameId);
            // Send all players an updated list of players
            socket.to(gameId).emit("Players", game.listPlayers());
        } catch (e) {
            console.log('Game not found!');
        }
    })
}
