import useUser from 'context/UserContext'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { User } from 'utils/UserUtil'

import styles from './casino-players.module.scss'

type Props = {
    users: User[]
}

type PlayerProps = {
    user: User,
    position: number
}

function CasinoPlayers()
{
    const { user } = useUser()

    let players: ReactNode[] = []

    if (user)
        for (let index = 0; index < 8; index++)
        {
            players.push(<CasinoPlayer user={user} position={index + 1} />)
        }


    return (
        <ul className={styles["casino-players"]}>
            {players}
        </ul>

    )
}

function CasinoPlayer({ user, position }: PlayerProps)
{
    return (
        <li className={`${styles["casino-player"]}`} data-spot={position}>
            <span className={styles["casino-player__avatar"]}>
                <Image src={user.avatar} width="100%" height={"100%"} />
            </span>
            <span className={styles["casino-player__username"]}>{user.username}</span>
        </li>
    )
}


export default CasinoPlayers