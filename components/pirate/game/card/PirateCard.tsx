import React, { MouseEvent, useEffect, useState } from 'react'

import { HiOutlineThumbUp, HiOutlineThumbDown } from 'react-icons/hi'
import { selectNextPlayer, selectTurns } from 'redux/pirate/slice'
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

export type PirateCardScheme = {
    background?: string,
    text?: string,
    shadow?: string
}


function PirateCard({ settings: { title, description, rotation = 0, isDummy = false, debug = false }, scheme }: Props)
{
    const [user, setUser] = useState<User>();
    const turns = useAppSelector(selectTurns);

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
            style={{ transform: `rotate(${rotation}deg)`, background: scheme?.background, boxShadow: `0 0px 5px ${scheme?.shadow}` }}
        >
            <div className={styles["card__contents"]} style={{ color: scheme?.text }}>
                <h1 className={styles["card__title"]} >{title}</h1>
                <p className={styles["card__description"]}>{description}</p>
            </div>
            {
                !isDummy &&
                <>
                    <div
                        style={{ color: scheme?.text ?? "", borderColor: scheme?.text ?? "" }}
                        className={styles["card__turns"]}>{turns}</div>
                    <div className={styles["card__indicators"]}>
                        {
                            !debug ?
                                <>
                                    <button
                                        style={{ color: scheme?.text ?? "" }}
                                        className={`${styles["card__indicator"]} ${styles["card__indicator--helpful"]}`}>
                                        <HiOutlineThumbUp />
                                    </button>
                                    <button
                                        style={{ color: scheme?.text ?? "" }}
                                        className={`${styles["card__indicator"]} ${styles["card__indicator--unhelpful"]}`}>
                                        <HiOutlineThumbDown />
                                    </button>
                                </> :
                                next === user?.uuid &&
                                <button className={styles["card__next"]} onClick={click}>Next Turn</button>
                        }
                    </div>
                </>
            }
        </div>
    )
}


export default PirateCard