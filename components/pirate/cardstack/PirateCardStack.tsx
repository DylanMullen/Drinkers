import React, { useEffect, useState } from 'react'
import PirateCard, { PirateCardSettings } from '../card/PirateCard'

import styles from './card-stack.module.scss'

type Props = {
    layers: number
    activeCard: PirateCardSettings
}

type StackCardProps = {
    style: React.CSSProperties
    activeCard?: PirateCardSettings,
    clickHandler?: React.MouseEventHandler<HTMLDivElement>
}

function PirateCardStack({ layers, activeCard }: Props)
{

    // const [cards, setCards] = useState<React.ReactNode[]>([])
    const [number, setNumber] = useState(layers);

    const removeTop = () =>
    {
        setNumber(prev => prev-1)
    }

    // if (cards.length === 0)
    // {
    //     for (let x = layers; x > 0; x--)
    //     {
    //         cards.push(

    //         );
    //         console.log("re running")
    //     }
    // }

    let cards = [];

    for (let x = number; x > 0; x--)
    {
        let rotation = (Math.random() * (x % 2 === 0 ? -1 : 1)) * 7;
        let isLast = x === 1
        cards.push(<StackCard
            key={x * Math.random() * 10}
            style={{ transform: `perspective(1500px) rotate(${isLast ? 0 : rotation}deg) translateY(${x * 4}px)` }}
            activeCard={isLast ? activeCard : undefined}
            clickHandler={isLast ? removeTop : () => { }}
        />)
    }

    return (
        <div className={styles["stack"]}>
            {
                cards
            }
        </div>
    )
}

function StackCard({ style, activeCard, clickHandler = () => { } }: StackCardProps)
{
    let isLast = activeCard !== undefined;
    return (
        <div
            className={styles["stack__card"] + " " + (isLast ? styles["stack__card--active"] : "")}
            style={style}
            onClick={clickHandler}
        >
            <PirateCard
                settings={activeCard ?? {
                    title: "",
                    description: "",
                    isDummy: true
                }}
            />
        </div >
    )
}

export default PirateCardStack