import PlayingCard, { CardStyle } from 'components/shared/playing-card/PlayingCard';
import { animate, AnimatePresence, AnimationControls, Variants } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/store';
import { HiLoActions, HiLoSelectors, hiloSlice } from 'services/hi-lo/redux/slice';
import HiLoCard from '../card/HiLoCard'

import {motion} from 'framer-motion'

import styles from './hilo-cards.module.scss'
import useUser from 'context/UserContext';
import Ribbon from 'components/shared/ribbon';

const width = 10;

const cardStyles: CardStyle[] = [
    {
        card: {
            cardBackground: "#1b1b1b",
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
                translateX: flipped ? "calc(-100% - 1rem)" : undefined,
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
                translateX: "calc(-100% - 1rem)",
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

function HiLoCards()
{
    const currentNumber = useAppSelector(HiLoSelectors.currentNumber)
    const flip = useAppSelector(HiLoSelectors.shouldFlip)
    const settings = useAppSelector(HiLoSelectors.settings)
    const nextPlayerUUID = useAppSelector(HiLoSelectors.nextUser)
    const canShowButtons = useAppSelector(HiLoSelectors.canShowButtons);
    const wasWinner = useAppSelector(HiLoSelectors.wasWinner)

    const { user } = useUser();

    const [previous, setPrevious] = useState(-1);
    const [shouldFlip, setFlip] = useState(false);
    const [reset, setReset] = useState(false);

    const nextPlayer = HiLoSelectors.getUser(nextPlayerUUID)

    const dispatch = useAppDispatch()


    const callback = () =>
    {
        setTimeout(() =>
        {
            if (previous !== -1)
                setPrevious(currentNumber)
            setReset(true)
            dispatch(HiLoActions.updateButtons(true))
            dispatch(HiLoActions.updateCard(false))
            setTimeout(() =>
            {
                setReset(false)
            }, 500)
        }, 500)
    }

    useEffect(() =>
    {
        if (!flip) return;
        setFlip(true)
        new Audio("/flip.mp3").play()
        setTimeout(() =>
        {
            if (previous === -1)
                setPrevious(currentNumber)
            setFlip(false)
        }, 750)
    }, [flip])

    useEffect(()=>{
        if(previous !== -1)return;
        setPrevious(currentNumber)
    },[currentNumber])

    let showButtons = ((user?.uuid === nextPlayerUUID || (nextPlayer?.bot === true && user?.uuid === settings.ownerID)) && canShowButtons && !wasWinner);

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
            <HiLoCard showButtons={showButtons}>
                <div className={styles["hilo-cards__stacked"]}>
                    <PlayingCard
                        cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                        flipSettings={{ clickable: false, defaultFlipped: true }}
                    />
                </div>
                <PlayingCard
                    settings={{
                        face: currentNumber,
                        suite: 0
                    }}
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{
                        clickable: false,
                        defaultFlipped: true,
                        flipAnimation: variants(true),
                        reset: reset,
                        shouldFlip: shouldFlip,
                        flipCallback: () => { callback() }
                    }}
                />
            </HiLoCard>
        </div>
    )
}

function HiLoCardsWrapper()
{
    const wasWinner = useAppSelector(HiLoSelectors.wasWinner)
    const [showWinner, setWinner] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() =>
    {
        if (!wasWinner) return;

        setTimeout(() =>
        {
            setWinner(true);
            new Audio("/win.wav").play()
            setTimeout(() =>
            {
                setWinner(false)
            }, 1250)
        }, 750)
    }, [wasWinner])

    const updateWinner = () =>
    {
        dispatch(HiLoActions.updateWinner(false))
    }

    return (
        <>
            <motion.div className={styles["hilo-wrapper"]}>
                <div className={styles["hilo-wrapper__ribbon"]}>
                    <Ribbon text='Winner Winner' show={showWinner} callback={updateWinner} />
                </div>
                <motion.div initial={{scale:0.75, opacity:0}} animate={{scale:1, opacity:1, transition:{ duration: 1}}}>
                <HiLoCards />
                </motion.div>
            </motion.div>
        </>
    )
}

export default HiLoCardsWrapper