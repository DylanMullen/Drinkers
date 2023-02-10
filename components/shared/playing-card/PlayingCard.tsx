import React, { lazy, useContext, useId, useState } from 'react'
import { LazyMotion, domAnimation, m, Variants, useAnimation } from 'framer-motion'

import { GiDiamonds, GiHearts, GiClubs, GiSpades } from 'react-icons/gi'

import styles from './playing-card.module.scss'
import Image from 'next/image'
import TextLogo from 'public/weblogo-text.svg'




type Props = {
    settings?: {
        suite: number,
        face: number,
    }
    cardStyles?: {
        red: CardStyle,
        black: CardStyle
    }
    flipSettings?: {
        defaultFlipped?: boolean,
        clickable?: boolean
    }
}

type Suite = {
    name: string,
    icon: React.ReactNode
}

export type CardStyle = {
    card?: {
        cardBackground?: string
        cardBorder?: string,
        width?: string,
        height?: string
    },
    pips?: {
        color?: string,
        size?: string
    }
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

const variants: Variants = {
    "init": {
        translateY: 0,
        scale: 1,
        rotateY: 0
    },
    "flip": {
        translateY: "-10rem",
        scale: 1.2,
        rotateY: 180,
        transition: {
            rotateY: {
                duration: .3,
                delay: .2
            }
        }
    },
    "flip-rev": {
        translateY: "-10rem",
        scale: 1.2,
        rotateY: 0,
        transition: {
            rotateY: {
                duration: .3,
                delay: .2
            }
        }
    },
    "flipped": {
        translateY: 0,
        scale: 1,
        rotateY: 180
    }
}

function PlayingCard({ settings = { face: 9, suite: 2 }, flipSettings = { clickable: true }, cardStyles }: Props)
{
    const [flipped, setFlipped] = useState(flipSettings?.defaultFlipped ?? false)
    const [isCooldown, setCooldown] = useState(false);
    const control = useAnimation();

    let pips: React.ReactNode[] = []

    const isRed = settings?.suite == 0 || settings?.suite == 1
    const colorStyle = isRed ? cardStyles?.red : cardStyles?.black;

    for (let index = 0; index < settings?.face; index++)
    {
        pips.push(<Pip icon={<PipIcon suite={settings.suite ?? 0} size={colorStyle?.pips?.size} />} color={colorStyle?.pips?.color} />)
    }

    const cardStyle: React.CSSProperties = {
        background: colorStyle?.card?.cardBackground,
        borderColor: colorStyle?.card?.cardBorder,
        width: colorStyle?.card?.width,
        height: colorStyle?.card?.height,
    }

    const onClick = () =>
    {
        if (!flipSettings.clickable || isCooldown)
            return;

        setCooldown(true)

        control.start(flipped ? "flip-rev" : "flip").then(() =>
        {
            control.start(flipped ? "init" : "flipped")
        }).then(() =>
        {
            setFlipped(prev => !prev)
            setCooldown(false)
        })
    }

    return (
        <LazyMotion features={domAnimation}>
            <m.div className={styles["playing-card"]} data-value={settings.face}
                onClick={onClick} variants={variants} animate={control} initial={flipped ? "flipped" : "init"}
                style={{ width: colorStyle?.card?.width, height: colorStyle?.card?.height }}
            >
                <div className={styles["playing-card__front"]} style={cardStyle}>
                    <ul className={styles["playing-card__pips"]}>
                        {pips}
                    </ul>
                </div>
                <div className={styles["playing-card__back"]} style={cardStyle}>
                    <Image
                        src={TextLogo}
                        style={{
                            // rotate: "-45deg"
                        }}
                        layout="responsive"
                    />
                </div>
            </m.div>
        </LazyMotion>
    )
}

function Pip({ icon, color }: { icon: React.ReactNode, color?: string })
{
    const id = useId()
    return (
        <li key={id} className={styles["playing-card__pip"]} style={{ color: color }}>
            {icon}
        </li>
    )
}

function PipIcon({ suite, size }: { suite: number, size?: string })
{
    let icon: React.ReactNode = undefined

    switch (suite)
    {
        case 0:
            icon = <GiHearts style={{ fontSize: size }} />
            break;
        case 1:
            icon = <GiDiamonds style={{ fontSize: size }} />
            break;
        case 2:
            icon = <GiClubs style={{ fontSize: size }} />
            break;
        case 3:
            icon = <GiSpades style={{ fontSize: size }} />
            break;
    }

    return (
        <>
            {icon}
        </>
    )
}

export default PlayingCard