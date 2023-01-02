import { WaterfallAction, WaterfallPlayer } from "redux/waterfall/types";
import store from "redux/store";
import { getWaterfallPlayers, thumbMaster, updateAction, updateModal } from "redux/waterfall/slice";
import { getUser, User } from "utils/UserUtil";
import { IoSnow } from "react-icons/io5";



export enum WaterfalActions
{
    WATERFALL = 0,
    DEMOCRACY,
    CATEGORIES,
    DATES,
    THUMBMASTER,
    QUESTION_MASTER,
    RULES,
    WILDCARD

}

export function sendAction(owner: string, current: WaterfallPlayer, action: WaterfallAction)
{
    const { id, content }: WaterfallAction = action;
    const user = getUser();
    const isOwner = user.uuid === owner;

    switch (id)
    {
        case WaterfalActions.WATERFALL: {
            handleWaterfall();
            break;
        }
        case WaterfalActions.DATES: {
            handleDate(user, current, isOwner, content)
            break;
        }
        case WaterfalActions.THUMBMASTER: {
            handleThumbmaster(current);
            break;
        }
        case WaterfalActions.RULES: {
            handleRuleMaster(user, current, isOwner, content)
            break;
        }
        case WaterfalActions.WILDCARD: {
            handleWildcard(user, current, isOwner, content)
            break;
        }
        default: {
            break;
        }
    }
    store.dispatch(updateAction(undefined))
}

function handleWaterfall()
{
    store.dispatch(updateModal({
        id: 1,
        show: true,
        content: {}
    }))
}

function handleDate(user: User, current: WaterfallPlayer, isOwner: boolean, content: any)
{
    if (!isValid(user.uuid, current.uuid, isOwner, current.offline ?? false)) return;

    store.dispatch(updateModal({
        id: 2,
        show: true,
        content: {
            dates: store.getState().waterfall.game.mechanics.dates,
            players: getWaterfallPlayers()
        }
    }))

}

function handleThumbmaster(current: WaterfallPlayer)
{
    store.dispatch(thumbMaster(current.uuid))
}

function handleRuleMaster(user: User, current: WaterfallPlayer, isOwner: boolean, content: any)
{
    if (!isValid(user.uuid, current.uuid, isOwner, current.offline ?? false)) return;

    store.dispatch(updateModal({
        id: 3,
        show: true,
        content: content
    }))

}


function handleWildcard(user: User, current: WaterfallPlayer, isOwner: boolean, content: any)
{
    // if (user.uuid !== current.uuid || !isOwner && current.offline) return;

    if (!isValid(user.uuid, current.uuid, isOwner, current.offline ?? false)) return;

    store.dispatch(updateModal({
        id: 4,
        show: true,
        content: content
    }))

}

function isValid(userUUID: string, currentUUID: string, isOwner: boolean, isBot: boolean)
{
    if (userUUID === currentUUID) return true;
    else if (isOwner && isBot) return true;
    else return false;
}