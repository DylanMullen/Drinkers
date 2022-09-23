import React, { useId } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectLobby, selectPlayers, updateModal } from 'redux/waterfall/slice';
import User from '../user/User';

import { FiPlusCircle } from 'react-icons/fi'

import styles from './userlist.module.scss';

type Props = {
    lobby?: boolean
}



function UserList({ lobby = false }: Props)
{

    const id = useId;
    const dispatch = useAppDispatch();

    const players = useAppSelector(selectPlayers).users;
    const readyPlayerList = useAppSelector(selectLobby);

    const playerList: React.ReactNode[] = [];


    const showAddPlayer = () =>
    {
        dispatch(updateModal({ id: 5, show: true, content: {} }))
    }


    for (let x = 0; x < Object.keys(players).length; x++)
    {
        let player = players[x];
        
        if (player === undefined) continue;

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

    if (playerList.length < 8)
        playerList.push(
            <button className={styles["waterfall-userlist__add"]} onClick={showAddPlayer}>
                <FiPlusCircle />
            </button>
        )

    return (
        <div data-users={playerList.length > 4 ? 4 : playerList.length} className={styles["waterfall-userlist"]}>
            <ul className={styles["waterfall-userlist__list"]}>
                {playerList}
            </ul>
        </div>
    )
}

export default UserList