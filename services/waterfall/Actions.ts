import { WaterfallAction } from "redux/waterfall/types";
import store from "redux/store";
import { getWaterfallPlayers, thumbMaster, updateAction, updateModal } from "redux/waterfall/slice";
import { getUser, User } from "utils/UserUtil";



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

export function sendAction(current: string, action: WaterfallAction)
{
    const { id, content }: WaterfallAction = action;
    const user = getUser();

    switch (id)
    {
        case WaterfalActions.WATERFALL: {
            handleWaterfall();
            break;
        }
        case WaterfalActions.DATES: {
            handleDate(user, current, content)
            break;
        }
        case WaterfalActions.THUMBMASTER: {
            handleThumbmaster(current);
            break;
        }
        case WaterfalActions.RULES: {
            handleRuleMaster(user, current, content)
            break;
        }
        case WaterfalActions.WILDCARD: {
            handleWildcard(user, current, content)
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

function handleDate(user: User, current: string, content: any)
{
    if (user.uuid !== current)
        return;

    store.dispatch(updateModal({
        id: 2,
        show: true,
        content: {
            dates: store.getState().waterfall.game.mechanics.dates,
            players: getWaterfallPlayers()
        }
    }))

}

function handleThumbmaster(current: string)
{
    store.dispatch(thumbMaster(current))
}

function handleRuleMaster(user: User, current: string, content: any)
{
    if (user.uuid !== current)
        return;

    store.dispatch(updateModal({
        id: 3,
        show: true,
        content: content
    }))

}


function handleWildcard(user: User, current: string, content: any)
{
    if (user.uuid !== current)
        return;

    store.dispatch(updateModal({
        id: 4,
        show: true,
        content: content
    }))

}