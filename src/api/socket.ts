import {Server, Socket} from 'socket.io';
import GameManager from '../services/manager';

interface SocketIO extends Socket {
    username: string,
    gameId?: string,
}

const manager = new GameManager();
export default async (socket: SocketIO, io: Server): Promise<void> => {

    socket.on('create', (game_name) => {
        // Create game
        const gameId = manager.generateGame(game_name);
        socket.emit('created', gameId);

    });

    socket.on('join', (data) => {
        try {
            // Add player to game object
            const game = manager.games[data.game_id];
            game.joinGame(data.username);
            socket.gameId = data.game_id;

            // Add player to game socket
            socket.join(data.game_id);

            // Tell user they've joined
            socket.emit('joined', {name: manager.games[data.game_id].name, gameId: data.game_id});

            // Send all players an updated list of players
            io.to(data.game_id).emit("players", game.listPlayers());
        } catch (e) {

            // If not game exists, send error
            socket.emit('error', "Game doesn't exist");
        }
    });
}
