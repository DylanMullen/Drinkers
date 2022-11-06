import React from 'react'

import { HiOutlineThumbUp, HiOutlineThumbDown } from 'react-icons/hi'

import styles from './piratecard.module.scss'

type Props = {
    settings: PirateCardSettings
    scheme?: PirateCardScheme
}

export type PirateCardSettings = {
    title: string
    description: string,
    isDummy?: boolean
}

type PirateCardScheme = {
    background: string
}

function PirateCard({ settings: { title, description, isDummy = false }, scheme }: Props)
{
    return (
        <div className={styles["card"]}>
            <div className={styles["card__contents"]}>
                <h1 className={styles["card__title"]}>{title}</h1>
                <p className={styles["card__description"]}>{description}</p>
            </div>
            {
                !isDummy &&
                <div className={styles["card__indicators"]}>
                    <button className={`${styles["card__indicator"]} ${styles["card__indicator--unhelpful"]}`}>
                        <HiOutlineThumbDown />
                    </button>
                    <button className={`${styles["card__indicator"]} ${styles["card__indicator--helpful"]}`}>
                        <HiOutlineThumbUp />
                    </button>
                </div>
            }
        </div>
    )
}

export default PirateCard