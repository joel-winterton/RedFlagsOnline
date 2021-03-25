import * as http from 'http';
import SocketRoutes from '../api/socket';
import {Server, Socket} from "socket.io";
import GameManager from "../services/manager";

interface SocketIO extends Socket {
    username: string,
    game: GameManager,
    gameId ?: string
}

export default async ({http}: { http: http.Server }): Promise<void> => {
    const io = new Server(http);
    io.on('connection', async (socket: SocketIO) => {
        console.log('Socket connected!')
        await SocketRoutes(socket);
    });
}
