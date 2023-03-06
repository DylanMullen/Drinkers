import { Variants, motion } from 'framer-motion'
import React, { ReactNode } from 'react'

import styles from './next-turn.module.scss'

type Props = {
    username: string,
    callbacks?: {
        end?: () => void
    }
}

type SideBitsProps = {
    index: number,
    delay: number,
    callback?: () => void
}

function NextTurn({ username, callbacks = { end: () => { } } }: Props)
{
    let bits: ReactNode[] = []

    let delay = 0;

    for (let index = 1; index < 11; index++)
    {

        bits.push(<SideBits index={index} delay={delay} callback={index === 10 ? callbacks.end : () => { }} />)
        delay += index > 5 ? 0.15 : 0.1
    }

    return (
        <div className={styles["next-turn__wrapper"]}>
            <motion.div className={styles["next-turn__main"]}
                initial="initMain" variants={variants(2)}
                animate="animateText"
            >
                <span>{username}'s Turn</span>
            </motion.div>
            {bits}
        </div>
    )
}

const variants: (speed: number) => Variants = (speed: number) =>
{
    return {
        init: {
            translateX: "100vw"
        },
        animate: {
            translateX: "-100vw",
            transition: {
                duration: 1.5,
                delay: speed,
            }
        },
        initMain: {
            translateX: ["100vw", "100vw"]
        },
        animateText: {
            translateX: ["100vw", "-10%", "-10%", "-120%"],
            transition: {
                duration: 1.75,
                ease: "easeInOut",
                times: [0, 0.3, 0.65, 1],
                delay: 0.25
            }
        }
    }
}

function SideBits({ index, delay, callback }: SideBitsProps)
{
    return (
        <motion.div className={styles["next-turn__sides"]}
            initial="init"
            animate="animate"
            variants={variants(delay)}
            data-key={index}
            onAnimationComplete={callback}
        />
    )
}

export default NextTurn