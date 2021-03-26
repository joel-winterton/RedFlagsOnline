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
    let connections = 0;
    io.on('connection', async (socket: SocketIO) => {
        // Load socket routes
        await SocketRoutes(socket, io);

        // Handle socket logging **Optional**
        socket.on('disconnect', () => {
            connections -= 1;
            console.clear();
            console.log(`Currently connected ${connections}`);

        })
        connections += 1;
        console.clear();
        console.log(`Currently connected ${connections}`);
    });
}
