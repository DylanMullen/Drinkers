import { intial } from "redux/pirate/slice";
import PirateState, { PiratePlayer, PiratePrompt } from "redux/pirate/types";
import store from "redux/store";
import { API_URL } from "settings/Config";
import { User } from "utils/UserUtil";
import PirateGame from "./PirateGame";


let instance: PirateGame;

export async function createPirateGame(packs: string[], player: User): Promise<Boolean>
{
    if (instance !== undefined) return false;

    let res = await sendCreateRequest(packs, player)

    if (res?.body?.error !== undefined) return false;

    let state: PirateState = res;
    store.dispatch(intial(state))

    instance = new PirateGame(state.settings.uuid, state.settings.joinCode)
    instance.socket.openSocket()
    return true;
}

export async function joinPirateGame(joinCode: string, player: PiratePlayer): Promise<Boolean>
{
    if (instance !== undefined) return false;

    let res = await sendJoinRequest(joinCode, player)

    if (res?.body?.error !== undefined) return false;

    console.log(res)

    let promptsIn: { [id: number]: PiratePrompt } = res.game.prompts
    let promptsOut: { [id: string]: PiratePrompt } = {}

    for (let index = 0; index < Object.keys(promptsIn).length; index++)
    {
        const element = promptsIn[parseInt(Object.keys(promptsIn)[index])];
        promptsOut[element.uuid] = element
    }


    let state: PirateState = res;
    state.game.prompts = promptsOut
    store.dispatch(intial(state))

    instance = new PirateGame(state.settings.uuid, state.settings.joinCode)
    instance.socket.openSocket()

    return true;
}

async function sendCreateRequest(packs: string[], player: User)
{
    return await fetch(API_URL + "/pirate/create", {
        method: "POST",
        body: JSON.stringify({
            player: player,
            settings: {
                ownerID: player.uuid,
                packs: packs,
                maxPlayers: 8
            }
        })
    }).then(res => res.json())
        .catch(err =>
        {
            return {
                body: {
                    error: err
                }
            }
        })
}

async function sendJoinRequest(joinCode: string, player: User)
{
    return await fetch(API_URL + "/pirate/join", {
        method: "POST",
        body: JSON.stringify({
            joinCode: joinCode,
            player: player
        })
    }).then(res => res.json())
        .catch(err =>
        {
            return {
                body: {
                    error: err
                }
            }
        })
}


export function getPirateInstance(): PirateGame
{
    return instance;
}