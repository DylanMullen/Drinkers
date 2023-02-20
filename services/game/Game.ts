import GameSocket, { GameRequest, GameResponse } from "./GameSocket";

export default abstract class Game 
{
    gameID: string;
    socket: GameSocket

    constructor(gameID: string, url: string)
    {
        this.gameID = gameID
        this.socket = new GameSocket(url, this.handle.bind(this))
    }

    abstract handle(data: GameResponse): void

    send(req: GameRequest)
    {
        this.socket.send(req)
    }

    isConnected()
    {
        return this.socket.connected
    }

    getID()
    {
        return this.gameID
    }

}