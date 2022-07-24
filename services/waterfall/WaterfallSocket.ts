import Game from "./Game";


export default class WaterfallSocket
{

    game: Game
    socket: WebSocket
    open: boolean

    constructor(game: Game)
    {
        this.game = game;
    }

    async startSocket()
    {
        return new Promise((resolve, reject) =>
        {

            let listen = this.listen.bind(this);
            let connected = this.setConnected.bind(this);

            let url = "wss://api.drinkers.beer:8443"

            this.socket = new WebSocket( url + "/waterfall/ws/" + this.game.uuid + "?uuid=" + this.game.cookie.uuid)

            this.socket.onmessage = listen
            this.socket.onopen = () =>
            {
                connected(true)
                resolve(this.open);
            }
            this.socket.onerror = () => reject(false);
        })
    }

    close()
    {
        this.socket.close();
    }

    setConnected(value: boolean)
    {
        this.open = value;
    }

    send(data: string)
    {

        this.socket.send(data)
    }

    listen(event: MessageEvent)
    {
        if (!this.isJSON(event.data))
            return;

        let json = JSON.parse(event.data);
        if (json === undefined)
            return;

        switch (json.action)
        {
            case 0: { //Player Joined
                this.game.handleNewPlayer(json.player, json.playerInfo)
                break;
            }
            case 1: {
                this.game.handleRemovedPlayer(json.uuid, json.players);
                break;
            }
            case 2: { //Next Turn
                this.game.handleNextTurnResponse(json.card, json.player)
                break;
            }
            case 3: {
                this.game.handleSkip(json.players)
                break;
            }
            case 4: { //New Date
                this.game.handleDate(json.date);
                break;
            }
            case 5: { //New Rule
                this.game.handleRule(json.rule);
                break;
            }
            case 6: {
                this.game.handleWildcard(json.card);
                break;
            }
            case 20: {
                this.game.handleReady(json.uuid)
                break;
            }
            case 21: {
                this.game.handleStart(json.card, json.player);
                break;
            }
            case 22: {
                this.game.handleEnd();
                break;
            }
        }
    }

    isJSON(data: any)
    {
        try
        {
            JSON.parse(data)
            return true;
        } catch {
            return false;
        }
    }



}