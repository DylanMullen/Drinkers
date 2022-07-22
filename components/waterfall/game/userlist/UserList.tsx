import React, { useId } from 'react'
import { useAppSelector } from 'redux/store';
import { selectPlayers } from 'redux/waterfall/slice';
import User from '../user/User';

import styles from './userlist.module.scss';

import { AiOutlinePlusCircle } from 'react-icons/ai'

type Props = {}



function UserList({ }: Props)
{

    const id = useId;

    const players = useAppSelector(selectPlayers).users;

    const playerList: React.ReactNode[] = [];

    for (let x = 0; x < Object.keys(players).length; x++)
    {
        let player = players[x];
        playerList.push(
            <User key={id + "-" + x} user={
                {
                    uuid: player.uuid,
                    username: player.username,
                    avatar: player.avatar
                }
            } />    
        )
    }

    // if (playerList.length < 8) playerList.push(<OfflinePlayer />)

    return (
        <div data-users={playerList.length > 4 ? 4 : playerList.length} className={styles["waterfall-userlist"]}>
            <ul className={styles["waterfall-userlist__list"]}>
                {playerList}
            </ul>
        </div>
    )
}

function OfflinePlayer()
{
    return (
        <button className={styles["waterfall-userlist__add"]}>
            <AiOutlinePlusCircle />
        </button>
    )
}

export default UserList