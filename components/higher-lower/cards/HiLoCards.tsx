import PlayingCard, { CardStyle } from 'components/shared/playing-card/PlayingCard';
import { AnimatePresence, AnimationControls, Variants } from 'framer-motion';
import React, { ReactNode, useState } from 'react'
import { useAppSelector } from 'redux/store';
import { HiLoSelectors } from 'services/hi-lo/redux/slice';
import HiLoCard from '../card/HiLoCard'
import { v4 as uuid } from 'uuid';

import styles from './hilo-cards.module.scss'

const width = 10;

const cardStyles: CardStyle[] = [
    {
        card: {
            cardBackground: "#2c2c2c",
            width: `${width}rem`,
            height: `${width * 1.4}rem`
        },
        pips: {
            color: "#e01e37",
            size: "1.75rem"
        }
    },
    {
        card: {
            cardBackground: "#1b1b1b",
            width: `${width}rem`,
            height: `${width * 1.4}rem`
        },
        pips: {
            color: "#dee2e6",
            size: "1.75rem"
        }
    }
]

const variants: (flipped: boolean) => Variants = (flipped: boolean) =>
{
    return (
        {
            "init": {
                translateY: 0,
                translateX: flipped ? "-12.6rem" : undefined,
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
                translateX: "0rem",

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
                translateX: "-12.6rem",
                scale: 1.2,
                rotateY: 0,
                transition: {
                    rotateY: {
                        duration: .3,
                        delay: .3
                    },
                    translateX: {
                        duration: .2,
                        delay: .2,
                        bounce: 0,
                    },
                }
            },
            "flipped": {
                translateY: 0,
                translateX: 0,
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
    )
}

type CardState = {
    [id: string]: ReactNode
}

function HiLoCards()
{
    let currentNumber = useAppSelector(HiLoSelectors.currentNumber)

    const [cards, setCards] = useState<CardState>({})
    const [reset, setReset] = useState(false);

    const [previous, setPrevious] = useState(5);

    const callback = (uuid: string) =>
    {
        setTimeout(() =>
        {
            setPrevious(currentNumber)
            setReset(true)
            setTimeout(() =>
            {
                setReset(false)
            }, 500)
        }, 500)
    }

    return (
        <div className={styles["hilo-cards"]}>

            <HiLoCard showButtons={false}>
                <PlayingCard
                    settings={{
                        face: previous,
                        suite: 0
                    }}
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: false, defaultFlipped: false, flipAnimation: variants(false), flipCallback: () => { } }}
                />
            </HiLoCard>
            <HiLoCard showButtons={false}>
                <div className={styles["hilo-cards__stacked"]}>
                    <PlayingCard
                        settings={{
                            face: currentNumber,
                            suite: 0
                        }}
                        cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                        flipSettings={{ clickable: false, defaultFlipped: true, flipAnimation: variants(true), reset: reset, flipCallback: () => { callback("") } }}
                    />

                </div>
                <PlayingCard
                    settings={{
                        face: currentNumber,
                        suite: 0
                    }}
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: true, defaultFlipped: true, flipAnimation: variants(true), reset: reset, flipCallback: () => { callback("") } }}
                />
            </HiLoCard>
        </div>
    )
}

export default HiLoCards