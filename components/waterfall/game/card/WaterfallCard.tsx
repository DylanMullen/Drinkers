import React, { useCallback, useEffect, useState } from 'react'

import { GiHearts as Hearts, GiDiamonds as Diamond, GiSpades as Spades, GiClubs as Clubs } from 'react-icons/gi'

import styles from './waterfallcard.module.scss'

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion"
import Image from 'next/image'


type Props = {
    cardDetails: CardDetails,
    ruleDetails: RuleDetails,
    flipSettings?: FlipSettings
}

type PipProps = {
    icon: React.ReactNode
}

export type CardDetails = {
    face: number,
    suite: number,
    hidden: boolean,
    cardOwner?: CardOwner | undefined
}

export type RuleDetails =
    {
        title: string,
        description: string,
    }

export type CardOwner = {
    uuid: string,
    username: string,
    avatar: string,
}

type FlipSettings = {
    onCreation?: {
        flip: boolean,
        delay: number
    },
    onUpdate?: {
        flip: boolean,
        delay: number
    }
    clickable: boolean,
    callback?: Function
}

export const Suites: any = {
    0: {
        name: "Hearts",
        icon: <Hearts />
    }, 1: {
        name: "Diamonds",
        icon: <Diamond />
    }, 2: {
        name: "Clubs",
        icon: <Clubs />
    }, 3: {
        name: "Spades",
        icon: <Spades />
    }
}


function WaterfallPlayingCard({ cardDetails, ruleDetails, flipSettings = { clickable: true, callback: () => { } } }: Props)
{

    const [isFlipped, setFlipped] = useState(
        (flipSettings.onCreation?.flip && flipSettings.onCreation.delay === 0) ?? false
    );
    const [isHidden, setHidden] = useState(flipSettings.onUpdate?.flip ?? false);

    const pips: React.ReactNode[] = []

    if (!isSpecial(cardDetails.face))
        for (let index = 0; index < cardDetails.face + 1; index++)
        {
            pips.push(<Pip icon={Suites[cardDetails.suite].icon} />)
        }

    const click = (e: React.MouseEvent<HTMLDivElement>): void =>
    {
        e.currentTarget.blur()
        if (flipSettings.clickable)
            flip(!isFlipped)
    }

    const flip = (show: boolean) =>
    {
        if (show)
        {
            setHidden(() => false)
            setFlipped(() => true)

            if (flipSettings && flipSettings.callback)
                flipSettings.callback();
            return;
        }
        setHidden(() => true)
        setFlipped(() => false)
    }

    useEffect(() =>
    {
        if (!flipSettings.onUpdate)
            return;
        if (flipSettings.onUpdate.flip && isFlipped)
        {
            flip(false);
            setTimeout(() =>
            {
                flip(true)
            }, flipSettings.onUpdate.delay)
        }

    }, [cardDetails])


    useEffect(() =>
    {
        if (!flipSettings.onCreation)
            return;
        if (flipSettings.onCreation.flip && !isFlipped)
            setTimeout(() =>
            {
                flip(true)
            }, flipSettings.onCreation.delay)

    }, [])

    let isRed = cardDetails.suite === 0 || cardDetails.suite === 1

    let clazz = `${styles["waterfall-card"]} 
                ${isFlipped ? styles["waterfall-card--flipped"] : ""} 
                ${flipSettings.clickable ? styles["waterfall-card--clickable"] : ""}`

    return (
        <div
            className={clazz}
            data-color={isRed ? "red" : "black"}
            data-value={cardDetails.face + 1}
            tabIndex={0}
            onClick={click}
        >
            <div className={styles["waterfall-card__back"]}>
                {!isHidden &&
                    <>
                        <header className={styles["waterfall-card__back__header"]}>
                            <div className={styles["waterfall-card__back__icon"]}>
                                {Suites[cardDetails.suite].icon}
                            </div>
                        </header>
                        <div className={styles["waterfall-card__back__body"]}>
                            <h1 className={styles["waterfall-card__title"]}>{ruleDetails.title}</h1>
                            <p className={styles["waterfall-card__description"]}>{ruleDetails.description}</p>
                        </div>
                        {
                            cardDetails.cardOwner !== undefined &&
                            <footer className={styles["waterfall-card__footer"]}>
                                {
                                    cardDetails.cardOwner &&
                                    <div className={styles["waterfall-card__user"]}>
                                        <div className={styles["waterfall-card__user__image"]}>

                                            <Image
                                                src={cardDetails.cardOwner.avatar}
                                                alt={"Avatar of " + cardDetails.cardOwner.username}
                                                width={"100%"} height="100%" />

                                        </div>
                                        <span className={styles["waterfall-card__user__name"]}>{cardDetails.cardOwner.username}</span>
                                    </div>
                                }
                            </footer>

                        }
                    </>
                }
            </div>
            <div className={styles["waterfall-card__front"]}>
                {
                    cardDetails.hidden ?
                        <div className={styles["waterfall-card__hidden"]} />
                        :
                        !isSpecial(cardDetails.face) ?
                            <ul className={styles["waterfall-card__pips"]}>
                                {pips}
                            </ul> :
                            <div className={styles["waterfall-card__special"]}>
                                <span>{getSpecialInitial(cardDetails.face)}</span>
                            </div>
                }
            </div>

        </div>
    )
}

function Pip({ icon }: PipProps)
{
    return (
        <li className={styles["waterfall-card__pip"]}>
            {icon}
        </li>
    )
}

function isSpecial(face: number)
{
    return face === 0 || face >= 10
}

function getSpecialInitial(face: number): string
{
    switch (face)
    {
        case 0: return "A"
        case 10: return "J"
        case 11: return "Q"
        case 12: return "K"
        default: return ""
    }
}

export default React.memo(WaterfallPlayingCard)