import useUser from 'context/UserContext'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { FaPlus } from 'react-icons/fa'
import { User } from 'utils/UserUtil'

import styles from './casino-players.module.scss'

type Props = {
    users: User[]
}

type PlayerProps = {
    user?: User,
    position: number,
}

// const positions = [
//     [4],
//     [4, 5],
//     [3, 4, 5],
//     [3, 4, 5, 6],
//     [2, 3, 4, 5, 6],
//     [2, 3, 4, 5, 6, 7],
//     [1, 2, 3, 4, 5, 6, 7],
//     [1, 2, 3, 4, 5, 6, 7, 8]
// ]

// const pos1 = [
//     [4],
//     [4, 5,3],
//     [4,5,3,6],
//     [4,5,3,6,2],
//     [4,5,3,6,2,7],
//     [4,5,3,6,2,7,1],
//     [4,5,3,6,2,7,1,8]
// ]

const pos2 = [4, 5, 3, 6, 2, 7, 1, 8]

function CasinoPlayers({ users }: Props)
{
    let players: ReactNode[] = []
    for (let index = 0; index < 8; index++)
    {
        players.push(<CasinoPlayer user={users[index]} position={pos2[index]} />)
    }

    // for (let index = 0; index < 8; index++)
    // {
    //     if (users.length > index) continue;
    //     players.push(<CasinoPlayer user={undefined} position={pos2[index]} />)
    // }

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