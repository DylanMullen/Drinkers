import React, { useId } from 'react';
import { useAppSelector } from 'redux/store';
import { selectLobby, selectPlayers } from 'redux/waterfall/slice';
import User from '../user/User';

import styles from './userlist.module.scss';

type Props = {
    lobby?: boolean
}



function UserList({ lobby = false }: Props)
{

    const id = useId;

    const players = useAppSelector(selectPlayers).users;
    const readyPlayerList = useAppSelector(selectLobby);

    const playerList: React.ReactNode[] = [];


    for (let x = 0; x < Object.keys(players).length; x++)
    {
        let player = players[x];
        let ready = readyPlayerList?.readyPlayers.includes(player.uuid);

        playerList.push(
            <User key={id + "-" + x}
                user={{
                    uuid: player.uuid,
                    username: player.username,
                    avatar: player.avatar
                }}
                settings={{ dummy: lobby, lobby: lobby ? { ready: ready ?? false } : undefined }}
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