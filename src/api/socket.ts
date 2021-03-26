import {Socket} from 'socket.io';
import GameManager from '../services/manager';

interface SocketIO extends Socket {
    username: string,
    gameId?: string,
}

const manager = new GameManager();
export default async (socket: SocketIO): Promise<void> => {

    socket.on('create', (game_name) => {
        // Create game
        const gameId = manager.generateGame(game_name);
        socket.emit('created', gameId);
    })

    socket.on('join', (data) => {
        try {

            // Add player to game object
            const game = manager.games[data.gameId];
            game.joinGame(data.username);
            socket.gameId = data.gameId;

            // Add player to game socket
            socket.join(data.gameId);
            // Tell user they've joined
            socket.emit('joined', {name: manager.games[data.gameId].name, gameId: data.gameId})
            // Send all players an updated list of players
            socket.to(data.gameId).emit("players", game.listPlayers());
        } catch (e) {
            // If not game exists, send error
            socket.emit('error', 'Game not found!');
        }
    });
}
