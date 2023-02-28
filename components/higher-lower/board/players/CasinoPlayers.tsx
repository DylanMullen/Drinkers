import useUser from 'context/UserContext'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import { User } from 'utils/UserUtil'

import styles from './casino-players.module.scss'

type Props = {
    users: User[]
}

type PlayerProps = {
    user?: User,
    position: number,
    isNext?:boolean
}

const pos2 = [4, 5, 3, 6, 2, 7, 1, 8]

function CasinoPlayers({ users }: Props)
{
    let nextPlayer = useAppSelector(HiLoSelectors.nextUser)
    let players: ReactNode[] = []
    for (let index = 0; index < 8; index++)
    {
        players.push(<CasinoPlayer user={users[index]} position={pos2[index]} isNext={users[index]?.uuid === nextPlayer ?? false} />)
    }

    return (
        <ul className={styles["casino-players"]}>
            {players}
        </ul>
    )
}

function CasinoPlayer({ user, position, isNext }: PlayerProps)
{
    return (
        <li className={`${styles["casino-player"]} ${isNext ? styles["casino-player--next"] : ""}`} data-spot={position}>
            {
                user ?
                    <>
                        <span className={styles["casino-player__avatar"]}>
                            <Image src={user?.avatar} width="100%" height={"100%"} />
                        </span>
                        <span className={styles["casino-player__username"]}>{user?.username}</span>
                    </>
                    :
                    <>
                        <button className={styles["casino-player__new"]}>
                            <FaPlus />
                        </button>
                    </>
            }

        </li>
    )
}

export default CasinoPlayers