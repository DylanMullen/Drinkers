import React, { useEffect, useState } from 'react'
import { newPrompt, selectPrompts } from 'redux/pirate/slice'
import { useAppDispatch, useAppSelector } from 'redux/store'
import PirateCard, { PirateCardSettings } from '../card/PirateCard'
import { v4 as uuid } from 'uuid';



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
    const dispatch = useAppDispatch()

    const prompts = useAppSelector(selectPrompts);

    let cards: React.ReactNode[] = [];

    const removeTop = () =>
    {
        let rotation = (Math.random() * (Math.random() < .25 ? -1 : 1)) * 7
        dispatch(newPrompt({ title: "", description: "", rotation: rotation, uuid: uuid() }))
    }

    let keys = Object.keys(prompts).reverse()

    return (
        <div className={styles["stack"]}>
            {
                keys.map((e, index) =>
                {
                    let isLast = index === keys.length - 1
                    let prompt = prompts[e];
                    return (

                        <StackCard
                            key={index}
                            style={{ transform: `perspective(1500px) rotate(${isLast ? 0 : prompt.rotation}deg) translateY(${index * -4}px)` }}
                            activeCard={isLast ? prompts[e] : undefined}
                            clickHandler={isLast ? removeTop : () => { }}
                        />
                    )
                })
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