import React, { lazy, useId } from 'react'
import { GiDiamonds, GiHearts, GiClubs, GiSpades } from 'react-icons/gi'

import styles from './playing-card.module.scss'



type Props = {
    settings?: {
        suite: number,
        face: number,
    }
    cardStyles?: {
        red: CardStyle,
        black: CardStyle
    }
}

type Suite = {
    name: string,
    icon: React.ReactNode
}

type CardStyle = {
    cardBackground: string
    cardBorder: string,
}

const Suites: Suite[] = [
    {
        name: "Hearts",
        icon: <GiHearts />
    },
    {
        name: "Diamonds",
        icon: <GiDiamonds />
    },
    {
        name: "Clubs",
        icon: <GiClubs />
    },
    {
        name: "Spades",
        icon: <GiSpades />
    }
]

function PlayingCard({ }: Props)
{
    let pips: React.ReactNode[] = []

    for (let index = 0; index < 2; index++)
    {
        pips.push(<Pip icon={Suites[3].icon} />)
    }
    return (
        <div className={styles["playing-card"]} data-value={2}>
            <div className={styles["playing-card__front"]}>
                <ul className={styles["playing-card__pips"]}>
                    {pips}
                </ul>
            </div>
            <div className={styles["playing-card__back"]}></div>
        </div>
    )
}

function Pip({ icon }: { icon: React.ReactNode })
{
    const id = useId()
    return (
        <li key={id} className={styles["playing-card__pip"]}>
            {icon}
        </li>
    )
}

export default PlayingCard