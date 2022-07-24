import React, { useId } from 'react'
import { useAppSelector } from 'redux/store';
import { selectPlayers } from 'redux/waterfall/slice';
import User from '../user/User';

import styles from './userlist.module.scss';

import { AiOutlinePlusCircle } from 'react-icons/ai'

type Props = {
    lobby?: boolean
}



function UserList({ lobby = false }: Props)
{

    const id = useId;

    const players = useAppSelector(selectPlayers).users;

    const playerList: React.ReactNode[] = [];

    for (let x = 0; x < Object.keys(players).length; x++)
    {
        let player = players[x];
        playerList.push(
            <User key={id + "-" + x}
                user={{
                    uuid: player.uuid,
                    username: player.username,
                    avatar: player.avatar
                }}
                settings={{ dummy: lobby, lobby: { ready: true } }}
            />
        )
    }

    return (
        <div data-users={playerList.length > 4 ? 4 : playerList.length} className={styles["waterfall-userlist"]}>
            <ul className={styles["waterfall-userlist__list"]}>
                {playerList}
            </ul>
        </div>
    )
}

export default UserList