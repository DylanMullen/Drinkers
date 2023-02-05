import { WEBSOCKET_URL } from "settings/Config";
import { json } from "stream/consumers";
import PirateGame from "./PirateGame";

enum Actions
{
    NEW_PLAYER = 1,
    PLAYER_LEFT,
    NEW_PROMPT,
}

export default class PirateGameSocket
{
    game: PirateGame;
    socket: WebSocket;
    connected: boolean;

    constructor(game: PirateGame)
    {
        this.game = game;
    }

    async openSocket()
    {
        let listen = this.listen.bind(this);
        let connected = this.setConnected.bind(this);

        let url = WEBSOCKET_URL
        this.socket = new WebSocket(url + "/pirate/ws/" + this.game.gameID);

        this.socket.onmessage = listen;
        this.socket.onopen = () => { connected(true); }
        this.socket.onerror = () => { connected(false); }

    }

    send(data: string): boolean
    {
        if (!this.connected) return false;

        this.socket.send(data)
        return true;
    }

    listen(event: MessageEvent)
    {
        let json = this.getJSON(event.data)

        if (json === undefined) return;
        switch (json.id)
        {
            case Actions.NEW_PLAYER:
                this.game.handleNewPlayer(json.body)
                break;
            case Actions.PLAYER_LEFT:
                break;
            case Actions.NEW_PROMPT:
                this.game.handleNextTurn({
                    current: json.body.current,
                    next: json.body.next
                }, json.body.turns, json.body.prompt)
                break;
            default:
                break;
        }

    }

    close()
    {
        this.socket.close();
    }

    setConnected(status: boolean)
    {
        this.connected = status;
    }

    getJSON(data: any): any
    {
        try
        {
            let res = JSON.parse(data)
            return res;
        } catch {
            return undefined;
        }
    }
}