import Image from 'next/image'
import React from 'react'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { removePlayer, selectGame } from 'redux/waterfall/slice';
import UserAdminBar from './admin-bar/UserAdminBar';
import UserStatusBar from './status-bar/UserStatusBar';

import styles from './user.module.scss';

import { getCookie } from 'cookies-next';
import { IoClose } from 'react-icons/io5';
import { getCurrentGame } from 'services/waterfall/GameController';

type Props = {
    user: UserDetails,
    dummy?: boolean
}

type UserDetails = {
    uuid: string,
    username: string,
    avatar: string,
    nextTurn?: boolean,
    admin?: boolean

}

function User({ user, dummy = false }: Props)
{
    const [isHovered, setHovered] = useState(false);

    let dispatch = useAppDispatch();

    let { ownerId, players } = useAppSelector(selectGame);

    let clientCookie = getCookie("user");
    let clientUUID = clientCookie !== undefined ? JSON.parse(clientCookie as string).uuid : ""


    let isNext = players.next === user.uuid;

    const kickUser = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        getCurrentGame().sendKickRequest(user.uuid);
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
                        isHovered && clientUUID === ownerId && user.uuid !== clientUUID && !dummy &&
                        < button className={styles["user__admin"]} onClick={kickUser}><IoClose /></button>
                    }
                    <Image src={user.avatar} width="100%" height="100%" alt={`Avatar of ${user.username}`}/>
                </div>
                <span className={styles["user__name"]}>{user.username}</span>
            </div>
        </li >
    )
}

export default User