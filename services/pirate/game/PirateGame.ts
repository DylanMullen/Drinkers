import PirateGameSocket from "./PirateGameSocket";
import store from "redux/store";
import { NextPlayerTurn, PiratePlayer, PiratePrompt } from "redux/pirate/types";
import { deleteFirstPrompt, hasPlayer, newPlayer, newPrompt, nextPlayer, removePlayer } from "redux/pirate/slice";
import { User } from "utils/UserUtil";

export default class PirateGame
{

    gameID: string;
    joinCode: string;
    socket: PirateGameSocket

    constructor(gameID: string, joinCode: string)
    {
        this.gameID = gameID;
        this.joinCode = joinCode
        this.init()
    }

    init()
    {
        this.socket = new PirateGameSocket(this)
    }

    getGameOwner()
    {
        return store.getState().pirate.settings.ownerID;
    }

    getNextPlayer()
    {
        return store.getState().pirate.game.players.next
    }


    sendNextTurn(uuid: string)
    {
        if (this.getNextPlayer() !== uuid) return;

        this.socket.send(JSON.stringify({
            "id": 3,
            "sender": uuid,
            "content": {}
        }))

    }

    /* Handlers */

    handleNewPlayer(player: User)
    {
        if (hasPlayer(player.uuid)) return;

        store.dispatch(newPlayer(player));
    }

    handlePlayerRemoved(uuid: string)
    {
        if (!hasPlayer(uuid)) return;

        store.dispatch(removePlayer(uuid));
    }

    handleNextTurn(nextPlayers: NextPlayerTurn, prompt: PiratePrompt)
    {
        store.dispatch(nextPlayer(nextPlayers))

        store.dispatch(deleteFirstPrompt())

        setTimeout(() =>
        {

            store.dispatch(newPrompt(prompt));

        }, 500)
    }


}