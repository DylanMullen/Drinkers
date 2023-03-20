import store from "redux/store";
import { API_URL } from "settings/Config";
import { User } from "utils/UserUtil";
import HiLoGameState, { CreateRequest, JoinRequest } from "../models/models";
import { HiLoActions } from "../redux/slice";
import HiLoGame from "./HiLoGame";

let instance: HiLoGame

type Response = {
    id: number,
    body: any
}

export const HiLoController = {
    create: create,
    createDummy:createDummy,
    join: join
}

async function create(user: User, type: "DICE" | "CARD")
{
    if (instance !== undefined) return;

    let res = await sendRequest("create", "POST", <CreateRequest>{
        owner: user,
        type: type,
    })

    if (res === undefined) return;
    instance = new HiLoGame((<HiLoGameState>res.body).settings.gameID)
    instance.socket.openSocket()
    store.dispatch(HiLoActions.init(res.body))
    return (<HiLoGameState>res.body).settings.joinCode
}

async function createDummy(user:User)
{
    let res = await sendRequest("create", "POST", <CreateRequest>{
        owner: user,
        type: "CARD",
    })

    if (res === undefined) return;
    return (<HiLoGameState>res.body).settings.joinCode
}

async function join(user: User, joinCode: string):Promise<boolean>
{
    if (instance !== undefined) return true;
    
    let res = await sendRequest("join", "POST", <JoinRequest>{
        joinCode,
        player: user
    })

    if (res === undefined || res.body.settings === undefined) return false;


    instance = new HiLoGame((<HiLoGameState>res.body).settings.gameID)
    instance.socket.openSocket()
    store.dispatch(HiLoActions.init(res.body))
    return true
}

async function sendRequest(url: string, method: string, data: any): Promise<Response | undefined>
{
    return fetch(API_URL + "/highlow/" + url, {
        method,
        body: JSON.stringify(data)
    }).then(e => e.json())
        .then(e => isResponse(e) ? e : undefined)
        .catch(_ => undefined)
}

function isResponse(res: any)
{
    return (res !== undefined && res.id !== undefined && res.body !== undefined);
}

export function getHigherLowerInstance()
{
    return instance;
}