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
        clickable?: boolean,
        flipAnimation?: Variants,
        flipCallback?: () => void
    }
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
        size?: string,
        special?: string
    }
}
const variants: Variants = {
    "init": {
        translateY: 0,
        scale: 1,
        rotateY: 0,
        transition: {
            translateY: {
                type: "tween",
                ease: "easeInOut",
            }
        }
    },
    "flip": {
        translateY: "-10rem",
        scale: 1.2,
        rotateY: 180,
        transition: {
            rotateY: {
                duration: .3,
                delay: .2
            },
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
            },
        }
    },
    "flipped": {
        translateY: 0,
        scale: 1,
        rotateY: 180,
        transition: {
            translateY: {
                type: "tween",
                ease: "easeInOut",
            }
        }
    }
}

function PlayingCard({ settings = { face: -1, suite: 2 }, flipSettings = { clickable: true, flipCallback: () => { } }, cardStyles }: Props)
{
    const [flipped, setFlipped] = useState(flipSettings?.defaultFlipped ?? false)
    const [isCooldown, setCooldown] = useState(false);
    const control = useAnimation();

    let pips: React.ReactNode[] = []

    const isRed = settings?.suite == 0 || settings?.suite == 1
    const colorStyle = isRed ? cardStyles?.red : cardStyles?.black;

    if (!isSpecial(settings.face))
        for (let index = 0; index < settings?.face + 1; index++)
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
            if (flipSettings.flipCallback)
                flipSettings.flipCallback()
                
            setFlipped(prev => !prev)
            setCooldown(false)
        })
    }

    return (
        <LazyMotion features={domAnimation}>
            <m.div className={styles["playing-card"]} data-value={settings.face}
                onClick={onClick} variants={flipSettings.flipAnimation ?? variants} animate={control} initial={flipped ? "flipped" : "init"}
                style={{ width: colorStyle?.card?.width, height: colorStyle?.card?.height }}
            >
                <div className={styles["playing-card__front"]} style={cardStyle}>
                    {
                        isSpecial(settings.face) ?
                            <span className={styles["playing-card__special"]}
                                style={{ fontSize: colorStyle?.pips?.special, color: colorStyle?.pips?.color, borderColor: colorStyle?.pips?.color }}>
                                {getSpecialInitial(settings.face)}
                            </span>
                            :
                            <ul className={styles["playing-card__pips"]}>
                                {pips}
                            </ul>
                    }
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

export default PlayingCard