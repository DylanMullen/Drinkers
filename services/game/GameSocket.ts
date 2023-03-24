import { WEBSOCKET_URL } from "settings/Config"

export type GameResponse = {
    id: number,
    body: any,
}

export type GameRequest = {
    id: number,
    sender: string,
    content: any
}

export default class GameSocket
{
    url: string
    socket: WebSocket
    connected: boolean

    handler: (data: GameResponse) => void

    constructor(url: string, handler: (data: GameResponse) => void)
    {
        this.url = WEBSOCKET_URL + url
        this.handler = handler;
    }

    async openSocket()
    {
        this.socket = new WebSocket(this.url)

        const connect = this.setConnected.bind(this);
        this.socket.onmessage = this.listen.bind(this)
        this.socket.onopen = () => connect(true)
        this.socket.onerror = () => connect(false);
    }

    send(req: GameRequest)
    {
        if (!this.connected) return;
        this.socket.send(JSON.stringify(req))
    }

    listen(event: MessageEvent)
    {
        let json = this.getJSON(event.data)
        if (json === undefined)
            return;
        if (json["id"] === undefined || json["body"] === undefined)
            return;

        this.handler(json)
    }

    setConnected(val: boolean)
    {
        this.connected = val;
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