import SubmitButton from 'components/shared/input/buttons/submit';
import React, { useEffect, useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getWaterfallPlayerByUUID, isReady, ready, selectGame, selectLobby } from 'redux/waterfall/slice';
import { WaterfallPlayer } from 'redux/waterfall/types';
import { getCurrentGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';
import WaterfallPlayingCard from '../card/WaterfallCard';
import UserCard from '../user';

import styles from './start-menu.module.scss';

type ReadyPlayerProps = {
    player: WaterfallPlayer
}

function StartMenu()
{
    const [user, setUser] = useState<User>();

    const dispatch = useAppDispatch();

    const lobby = useAppSelector(selectLobby)
    const game = useAppSelector(selectGame);

    const owner = getWaterfallPlayerByUUID(game.ownerId);

    const containsUser = isReady(user?.uuid ?? "");

    useEffect(() =>
    {
        setUser(getUser());
    }, [])

    const click = () =>
    {
        getCurrentGame().sendReadyRequest(user?.uuid ?? "");
    }

    const start = () =>
    {
        getCurrentGame().sendStartRequest();
    }

    let readySize = lobby?.readyPlayers.length ?? 0;
    let players = Object.keys(game.players.users).length;
    let showStart = owner?.uuid === user?.uuid && (readySize >= players / 2)
    let showControl = !containsUser || showStart

    return (
        <div className={styles["waterfall-startmenu__wrapper"]}>

        </div>
    )
}

function ReadyPlayerList()
{
    const players = useAppSelector(selectLobby)?.readyPlayers;

    let readyPlayer = []

    if (players)
        for (let index = 0; index < players.length; index++)
        {
            const player = getWaterfallPlayerByUUID(players[index])
            if (!player)
                continue;
            readyPlayer.push(<ReadyPlayer player={player} />);
        }

    return (

        <>
            <ul className={styles["waterfall-startmenu__ready"]}>
                {readyPlayer}
            </ul>
        </>
    )
}

function ReadyPlayer({ player }: ReadyPlayerProps)
{
    return (
        <li className={styles["waterfall-startmenu__ready__player"]}>
            <UserCard
                user={player}/>
            <div className={styles["waterfall-startmenu__ready__icon"]}>
                <IoMdCheckmarkCircleOutline />
            </div>
        </li>
    )
}

export default StartMenu