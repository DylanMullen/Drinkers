import { WEBSOCKET_URL } from "settings/Config";
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

        let listen = this.listen.bind(this);
        let connected = this.setConnected.bind(this);

        let url = WEBSOCKET_URL
        this.socket = new WebSocket(url + "/waterfall/ws/" + this.game.uuid + "?uuid=" + this.game.cookie.uuid)

        this.socket.onmessage = listen
        this.socket.onopen = () =>
        {
            connected(true)
        }
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
        if (!this.open)
            return;
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
                this.game.handleReady(json.uuid, json.type)
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
            case 23: {
                this.game.handleUpdateSetting(json.setting, json.value)
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