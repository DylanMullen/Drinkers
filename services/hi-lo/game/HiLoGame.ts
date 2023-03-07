import { CardStyle } from "components/shared/playing-card/PlayingCard"
import store from "redux/store"
import Game from "services/game/Game"
import { GameResponse } from "services/game/GameSocket"
import { HigherLowerPlayer, NewPlayer, NextTurnUpdate, Prompt, Theme } from "../models/models"
import { HiLoActions, HiLoSelectors, hiloSlice } from "../redux/slice"

export default class HiLoGame extends Game
{
    constructor(gameID: string)
    {
        super(gameID, `/highlow/ws/${gameID}`)
    }

    handle(data: GameResponse): void
    {
        console.log(data)
        switch (data.id)
        {
            case 0: this.handleGameState(data.body.started); break;
            case 1: this.handleNewPlayer(data.body); break;
            case 2: this.handleLeave(data.body.uuid); break;
            case 3: this.handleNextTurn(data.body); break;
            case 4: this.handleLeave(data.body.uuid); break;
            case 5: this.handlePromoted(data.body.uuid); break;
            case 6: this.handlePrompt(data.body); break;
            case 7: this.handleTheme(data.body);break;
            default: break;
        }
    }

    sendNextTurn(type: string, sender: string)
    {
        let nextPlayer = HiLoSelectors.getUser(store.getState().hilo.gameplay.players.next)
        let owner = store.getState().hilo.settings.ownerID

        if (nextPlayer?.uuid === sender || (nextPlayer?.bot && owner === sender))
        {
            this.send({
                id: 3,
                sender,
                content: {
                    action: type
                }
            })
        }
    }

    sendBotRequest(sender: string, bot: HigherLowerPlayer)
    {
        this.send({
            id: 1,
            sender,
            content: {
                joinCode: "",
                player: bot
            }
        })
    }

    sendLeaveRequest(sender: string)
    {
        this.send({
            id: 2,
            sender,
            content: {
                uuid: sender
            }
        })
    }

    sendKickRequest(uuid: string, sender: string)
    {
        if (!this.isOwner(sender)) return;

        this.send({
            id: 4,
            sender,
            content: {
                uuid: uuid
            }
        })
    }

    sendGameStateRequest(start: boolean, sender: string)
    {
        if (!this.isOwner(sender)) return;

        this.send({
            id: 0,
            sender,
            content: {
                state: start
            }
        })
    }

    sendPromotionRequest(uuid: string, sender: string)
    {
        if (!this.isOwner(sender)) return;

        this.send({
            id: 5,
            sender,
            content: {
                uuid: uuid
            }
        })
    }

    sendTableAdjust(color: string, sender: string)
    {
        this.send({
            id: 7,
            sender,
            content: {
                type: "table",
                table: color
            }
        })
    }

    sendCardTheme(style: CardStyle[], sender: string)
    {
        this.send({
            id: 7,
            sender,
            content: {
                type: "card",
                red: style[0],
                black: style[1]
            }
        })
    }


    handleNextTurn(nextTurn: NextTurnUpdate)
    {
        store.dispatch(HiLoActions.nextTurn(nextTurn))
        store.dispatch(HiLoActions.updateCard(true))
        store.dispatch(HiLoActions.updateButtons(false))
    }

    handleNewPlayer(join: NewPlayer)
    {
        store.dispatch(HiLoActions.addPlayer(join.player))
        store.dispatch(HiLoActions.updatePlayerPositions(join))
    }

    handleLeave(uuid: string)
    {
        store.dispatch(HiLoActions.removePlayer(uuid))
    }

    handlePromoted(uuid: string)
    {
        store.dispatch(HiLoActions.updateOwner(uuid))
    }

    handleGameState(started: boolean)
    {
        store.dispatch(HiLoActions.updateGameState(started))
    }

    handlePrompt(prompt: Prompt | undefined)
    {
        console.log(prompt)
        store.dispatch(HiLoActions.updatePrompt(prompt))
    }

    handleTheme(theme: Theme)
    {
        store.dispatch(HiLoActions.updateTheme(theme))
    }

    isOwner(uuid: string)
    {
        return store.getState().hilo.settings.ownerID === uuid
    }

}