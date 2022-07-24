import Image from 'next/image'
import React from 'react'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { removePlayer, selectGame, selectLobby } from 'redux/waterfall/slice';
import UserAdminBar from './admin-bar/UserAdminBar';
import UserStatusBar from './status-bar/UserStatusBar';

import styles from './user.module.scss';

import { getCookie } from 'cookies-next';
import { IoClose } from 'react-icons/io5';
import { getCurrentGame } from 'services/waterfall/GameController';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { IoMdClose as CloseIcon } from 'react-icons/io'

type Props = {
    user: UserDetails,
    settings?: {
        dummy?: boolean
        lobby?: {
            ready: boolean
        }
    }
}

type UserDetails = {
    uuid: string,
    username: string,
    avatar: string,
    nextTurn?: boolean,
    admin?: boolean

}

function User({ user, settings: { dummy, lobby } = { dummy: false, lobby: { ready: false } } }: Props)
{
    const [isHovered, setHovered] = useState(false);

    let { ownerId, players } = useAppSelector(selectGame);
    
    let clientCookie = getCookie("user");
    let clientUUID = clientCookie !== undefined ? JSON.parse(clientCookie as string).uuid : ""
    
    
    let isNext = players.next === user.uuid;
    
    const kickUser = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        getCurrentGame().sendKickRequest(user.uuid);
    }
    
    const readyUp = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.currentTarget.blur()
        getCurrentGame().sendReadyRequest(clientUUID);
    }

    return (
        <li className={`${styles["user__wrapper"]} ${isNext && !dummy ? styles["user--next"] : ""}`}>

            <div className={styles["user"]}

            >
                {
                    !dummy &&
                    <div className={styles["user__status"]}>
                        <UserStatusBar uuid={user.uuid} username={user.username} />
                    </div>
                }

                <div className={styles["user__avatar"]}
                    onMouseEnter={() => setHovered(prev => !prev)}
                    onMouseLeave={() => setHovered(prev => !prev)}
                >
                    {
                        isHovered && clientUUID === ownerId && user.uuid !== clientUUID &&
                        < button className={styles["user__admin"]} onClick={kickUser}><IoClose /></button>
                    }
                    <Image src={user.avatar} width="100%" height="100%" alt={`Avatar of ${user.username}`} />
                </div>
                <span className={styles["user__name"]}>{user.username}</span>
                {
                    lobby &&
                    <button className={styles["user__ready"]} data-ready={lobby.ready}
                        disabled={user.uuid !== clientUUID}
                        onClick={readyUp}>
                        {
                            lobby.ready ?
                                <IoMdCheckmarkCircleOutline /> : <CloseIcon />
                        }
                    </button>
                }
            </div>
        </li >
    )
}

export default User