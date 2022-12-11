import { getCookie } from "cookies-next";
import store from "redux/store";
import { getWaterfallPlayerByUUID, getWaterfallPlayerIndex, getWaterfallPlayers, kicked, lobby, newDate, newPlayer, newRule, nextCard, nextPlayer, ready, removePlayer, start, thumbMaster, unready, updateAction, updateModal, updateSetting } from "redux/waterfall/slice";
import { PayloadNextUser, WaterfallCard, WaterfallDate, WaterfallModal, WaterfallPlayer, WaterfallRule } from "redux/waterfall/types";
import { sendAction } from "./Actions";
import WaterfallSocket from "./WaterfallSocket";


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

    sendUpdateSetting(setting: string, value: any)
    {
        let request = {
            action: 23,
            senderUUID: this.cookie.uuid,
            setting: setting,
            value: value
        }
        this.socket.send(JSON.stringify(request));
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
        this.socket.send(JSON.stringify(request))
    }

    sendOfflinePlayerRequest(player: WaterfallPlayer)
    {
        let request = {
            action: 24,
            senderUUID: this.cookie.uuid,
            uuid: player.uuid,
            username: player.username,
            avatar: player.avatar,
        }
        this.socket.send(JSON.stringify(request))
    }

    // HANDLERS


    handleReady(uuid: string, type: number)
    {
        if (type === 0)
        {
            store.dispatch(unready(uuid))
            return;
        }
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
        {
            store.dispatch(updateAction(card.details.action))
        }
    }

    handleUpdatePlayers(players: PayloadNextUser)
    {
        store.dispatch(nextPlayer(players))
    }

    handleSkip(players: PayloadNextUser)
    {
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
        store.dispatch(nextCard({ ...card, cardsLeft: store.getState().waterfall.card.cardsLeft }))

        if (card.details.action)
            store.dispatch(updateAction(card.details.action))
    }

    handleUpdateSetting(setting: string, value: any)
    {
        store.dispatch(updateSetting({ setting, value }))
    }

    handleAction()
    {
        const action = store.getState().waterfall.game.action;
        const current = store.getState().waterfall.game.players.current

        if (!action || !store.getState().waterfall.game.mechanics.actions)
            return;


        sendAction(current, action)
    }


    //UTILS
    isNextPlayer(): boolean
    {
        let player = getWaterfallPlayerByUUID(store.getState().waterfall.game.players.next);
        let owner = store.getState().waterfall.game.ownerId
        return (player?.uuid === this.cookie.uuid || (player?.offline && owner === this.cookie.uuid)) ?? false
    }

    // handleActions(current: string, action: any): void
    // {
    //     let modal: WaterfallModal | undefined = store.getState().waterfall.game.modal

    //     switch (action.id)
    //     {
    //         case 0: {
    //             store.dispatch(thumbMaster(current))
    //             break;
    //         }
    //         case 1: {
    //             modal = {
    //                 type: 0,
    //                 content: {
    //                     players: getWaterfallPlayers(),
    //                     dates: store.getState().waterfall.game.mechanics.dates
    //                 }
    //             }
    //             break;
    //         }
    //         case 2: {
    //             modal = {
    //                 type: 1,
    //                 content: {
    //                     suggestions: action.suggestions
    //                 }
    //             }
    //             break;
    //         }
    //         case 3: {
    //             modal = {
    //                 type: 3,
    //                 content: {
    //                     cards: action.cards
    //                 }
    //             }
    //             break;
    //         }

    //         default:
    //             break;
    //     }

    //     if (this.cookie.uuid !== current)
    //         return;


    //     store.dispatch(updateModal(modal))
    // }

    closeModal(): void
    {
        store.dispatch(updateModal(undefined))
    }
}
