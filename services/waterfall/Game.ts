import { getCookie } from "cookies-next";
import React from "react";
import store from "redux/store";
import { getWaterfallPlayerByUUID, getWaterfallPlayerIndex, getWaterfallPlayers, kicked, leave, lobby, newDate, newPlayer, newRule, nextCard, nextPlayer, ready, removePlayer, start, thumbMaster, updateModal } from "redux/waterfall/slice";
import { PayloadNextUser, WaterfallCard, WaterfallDate, WaterfallModal, WaterfallPlayer, WaterfallRule } from "redux/waterfall/types";
import WaterfallSocket from "./WaterfallSocket";

import RuleModal from "components/waterfall/game/modals/rule-modal/RuleModal";
import { stopCoverage } from "v8";

export default class Game
{

    uuid: string
    gameCode: string

    socket: WaterfallSocket
    cookie: any

    modal: any;


    constructor(uuid: string, gameCode: string)
    {
        this.uuid = uuid;
        this.gameCode = gameCode

        this.init()
    }

    init()
    {
        this.socket = new WaterfallSocket(this);

        let tempCookie = getCookie("user") as string;
        this.cookie = tempCookie !== undefined ? JSON.parse(tempCookie) : undefined;
    }

    //SENDERS

    sendReadyRequest(uuid: string)
    {
        if (uuid === "")
            return
        this.socket.send(JSON.stringify({
            action: 20,
            senderUUID: this.cookie.uuid,
            uuid: uuid
        }))
    }

    sendStartRequest()
    {
        this.socket.send(JSON.stringify({
            action: 21,
            senderUUID: this.cookie.uuid
        }))
    }

    sendKickRequest(playerUUID: string)
    {
        let request = {
            action: 1,
            senderUUID: this.cookie.uuid,
            playerUUID: playerUUID
        }

        this.socket.send(JSON.stringify(request))
    }

    sendNextTurnRequest()
    {
        if (!this.isNextPlayer())
            return;

        let request = {
            action: 2,
            senderUUID: this.cookie.uuid
        }

        this.socket.send(JSON.stringify(request))
    }

    sendSkipTurnRequest()
    {
        let request = {
            action: 3,
            senderUUID: this.cookie.uuid
        }

        this.socket.send(JSON.stringify(request))
    }

    sendDateRequest(date: WaterfallDate)
    {
        let request = {
            action: 4,
            senderUUID: this.cookie.uuid,
            date: date
        }
        this.socket.send(JSON.stringify(request));
    }

    sendRuleRequest(rule: WaterfallRule)
    {
        let request = {
            action: 5,
            senderUUID: this.cookie.uuid,
            rule: rule
        }

        this.socket.send(JSON.stringify(request));
    }

    sendWildcardRequest(card: WaterfallCard)
    {
        let request = {
            action: 6,
            senderUUID: this.cookie.uuid,
            card: card
        }
        console.clear()
        this.socket.send(JSON.stringify(request))
    }

    // HANDLERS


    handleReady(uuid: string)
    {
        store.dispatch(ready(uuid));
    }

    handleStart(card: WaterfallCard, players: any)
    {
        this.handleNextTurnResponse(card, players);
        store.dispatch(start())
    }

    handleEnd()
    {
        store.dispatch(lobby())
    }

    handleNewPlayer(player: WaterfallPlayer, playerInfo: PayloadNextUser)
    {
        if (getWaterfallPlayerByUUID(player.uuid))
            return;

        store.dispatch(newPlayer(player))
        store.dispatch(nextPlayer(playerInfo))
    }

    handleRemovedPlayer(uuid: string, players: PayloadNextUser)
    {
        if (uuid === this.cookie.uuid)
        {   
            console.log("herer")
            this.socket.close();
            store.dispatch(kicked());
            return;
        }


        let index = getWaterfallPlayerIndex(uuid);

        if (index === undefined)
            return;

        store.dispatch(removePlayer(index))
        store.dispatch(nextPlayer(players))
    }

    handleNextTurnResponse(card: WaterfallCard, players: any)
    {
        store.dispatch(nextCard(card))
        store.dispatch(nextPlayer({ current: players.current, next: players.next }))

        if (card.details.action)
            this.handleActions(players.current, card.details.action)
    }

    handleUpdatePlayers(players: PayloadNextUser)
    {
        store.dispatch(nextPlayer(players))
    }

    handleSkip(players: PayloadNextUser)
    {
        console.log(players + " ")
        store.dispatch(nextPlayer(players))
    }

    handleDate(date: WaterfallDate)
    {
        store.dispatch(newDate(date));
    }

    handleRule(rule: WaterfallRule)
    {
        store.dispatch(newRule(rule))
    }

    handleWildcard(card: WaterfallCard)
    {
        store.dispatch(nextCard(card))

        if (card.details.action)
            this.handleActions(card.creatorUUID, card.details.action)
    }



    //UTILS
    isNextPlayer(): boolean
    {
        return store.getState().waterfall.game.players.next === this.cookie.uuid
    }

    handleActions(current: string, action: any): void
    {
        let modal: WaterfallModal | undefined = store.getState().waterfall.game.modal

        switch (action.id)
        {
            case 0: {
                store.dispatch(thumbMaster(current))
                break;
            }
            case 1: {
                modal = {
                    type: 0,
                    content: {
                        players: getWaterfallPlayers(),
                        dates: store.getState().waterfall.game.mechanics.dates
                    }
                }
                break;
            }
            case 2: {
                modal = {
                    type: 1,
                    content: {
                        suggestions: action.suggestions
                    }
                }
                break;
            }
            case 3: {
                modal = {
                    type: 3,
                    content: {
                        cards: action.cards
                    }
                }
                break;
            }

            default:
                break;
        }

        if (this.cookie.uuid !== current)
            return;


        store.dispatch(updateModal(modal))
    }

    closeModal(): void
    {
        store.dispatch(updateModal(undefined))

    }
}
