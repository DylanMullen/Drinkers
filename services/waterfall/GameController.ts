import { Error } from "components/waterfall/lobby/modals/join/JoinModal";
import store from "redux/store";
import { join } from "redux/waterfall/slice";
import WaterfallState, { WaterfallPlayer } from "redux/waterfall/types";
import { API_URL } from "settings/Config";
import Game from "./Game";

type WaterfallGameSettings = {
    owner: WaterfallPlayer,
    settings: {
        gameName: string,
        hiddenBack: boolean
        maxPlayers: number
        actionsEnabled: boolean
    }
}

type WaterfallJoinRequest = {
    joinCode: string,
    player: WaterfallPlayer
}

var currentGame: Game;

interface PlayerList
{
    [x: number]: WaterfallPlayer
}

export function getCurrentGame(): Game
{
    return currentGame
}

export async function createWaterfallGame(settings: WaterfallGameSettings)
{
    let response = await sendCreateRequest(settings);

    if (response.error)
        return;

    let state: WaterfallState = convertToState(response);
    store.dispatch(join(state));

    currentGame = new Game(state.game.gameId, state.game.joinCode);
    currentGame.socket.startSocket();

    return currentGame.gameCode
}

export async function joinWaterfallGame(joinRequest: WaterfallJoinRequest): Promise<Error | string | undefined>
{
    if (currentGame !== undefined && currentGame.gameCode === joinRequest.joinCode)
        return currentGame.gameCode;

    let response = await sendJoinRequest(joinRequest);
    if (response.error)
        return { message: response.error };


    let state: WaterfallState = convertToState(response);
    store.dispatch(join(state));

    currentGame = new Game(state.game.gameId, state.game.joinCode);

    currentGame.socket.startSocket();
    return currentGame.gameCode;
}

async function sendCreateRequest(settings: WaterfallGameSettings)
{
    return await fetch(API_URL + "/waterfall/create", {
        method: "POST",
        body: JSON.stringify({
            owner: {
                ...settings.owner
            },
            settings: {
                ...settings.settings,
                maxPlayers: Number(settings.settings.maxPlayers)
            }
        })
    }).then(res => res.json())
}

async function sendJoinRequest(request: WaterfallJoinRequest)
{
    return await fetch(API_URL + "/waterfall/join", {
        method: "POST",
        body: JSON.stringify(request)
    }).then(res => res.json())
}


function convertToState(response: any)
{
    let users: PlayerList = {}


    for (let x = 0; x < response.game.players.users.length; x++)
    {
        const element = response.game.players.users[x];
        let player: WaterfallPlayer = element;
        users[x] = player;
    }

    response.game.players.users = users;

    return response;
}
