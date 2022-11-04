import React, { useEffect, useId, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectLobby, selectOwnerId, selectPlayers, selectStarted, updateModal } from 'redux/waterfall/slice';
import { FiPlusCircle } from 'react-icons/fi'

import styles from './userlist.module.scss';
import { getUser, User as TUser} from 'utils/UserUtil';
import User from '../user/User';

type Props = {
    lobby?: boolean
}



function UserList({ lobby = false,  }: Props)
{
    const [user,setUser] = useState<TUser>();
    const id = useId;
    const dispatch = useAppDispatch();
    
    const owner = useAppSelector(selectOwnerId);
    const players = useAppSelector(selectPlayers).users;
    const readyPlayerList = useAppSelector(selectLobby);
    let started = useAppSelector(selectStarted)


    const playerList: React.ReactNode[] = [];

    useEffect(()=>{
        setUser(getUser())
    },[])

    const showAddPlayer = () =>
    {
        dispatch(updateModal({ id: 5, show: true, content: {} }))
    }


    for (let x = 0; x < Object.keys(players).length; x++)
    {
        let player = players[x];

        if (player === undefined) continue;

        let ready = readyPlayerList?.readyPlayers.includes(player.uuid) || player.offline;

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

    if (playerList.length < 8 && owner===user?.uuid && !started)
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