import React, { MouseEvent, useEffect, useState } from 'react'

import { HiOutlineThumbUp, HiOutlineThumbDown } from 'react-icons/hi'
import { selectNextPlayer } from 'redux/pirate/slice'
import { useAppSelector } from 'redux/store'
import { getPirateInstance } from 'services/pirate/game/PirateGameController'
import { getUser, User } from 'utils/UserUtil'

import styles from './piratecard.module.scss'

type Props = {
    settings: PirateCardSettings
    scheme?: PirateCardScheme
}

export type PirateCardSettings = {
    title: string
    description: string,
    rotation?: number,
    isDummy?: boolean,
    debug?: boolean
}

type PirateCardScheme = {
    background: string
}

function PirateCard({ settings: { title, description, rotation = 0, isDummy = false, debug = false }, scheme }: Props)
{
    const [user, setUser] = useState<User>();

    const next = useAppSelector(selectNextPlayer);

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    const click = (e: MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        getPirateInstance().sendNextTurn(user?.uuid ?? "")
    }

    return (
        <div 
            className={styles["card"]}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className={styles["card__contents"]}>
                <h1 className={styles["card__title"]}>{title}</h1>
                <p className={styles["card__description"]}>{description}</p>
            </div>
            {
                !isDummy &&
                <div className={styles["card__indicators"]}>
                    {
                        !debug ?
                            <>
                                <button className={`${styles["card__indicator"]} ${styles["card__indicator--helpful"]}`}>
                                    <HiOutlineThumbUp />
                                </button>
                                <button className={`${styles["card__indicator"]} ${styles["card__indicator--unhelpful"]}`}>
                                    <HiOutlineThumbDown />
                                </button>
                            </> :
                            next === user?.uuid &&
                            <button className={styles["card__next"]} onClick={click}>Next Turn</button>
                    }
                </div>
            }
        </div>
    )
}

export default PirateCard