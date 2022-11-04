import Backdrop from 'components/shared/backdrop/Backdrop'
import { AnimatePresence, domAnimation, LazyMotion, motion, Variant, Variants } from 'framer-motion'
import React, { useState } from 'react'

import styles from './popover-action.module.scss'

type Props = {
    title: string,

}

function PopoverAction({ title }: Props)
{
    const [open, setOpen] = useState(true);


    const variant: Variants = {
        initial: {
            backgroundColor: "rgba(102, 15, 163, 0)"
        },
        creation: {
            backgroundColor: "rgba(102, 15, 163, 0.5)",
            transition: {
                duration: 0.25,
                repeat: 4,
                repeatType: "mirror"
            }
        },
        exit: {
            backgroundColor: "rgba(102, 15, 163, 0)"
        }
    }

    const container: Variants = {
        initial: {
            y: "10vh",
            opacity: 1,
        },
        creation: {
            y: 0,
            opacity: 1,
            transition: {
                duration: .5,
                ease: [0.175, 0.885, 0.32, 1.275]
            }
        },
        exit: {
            y: "10vh",
            opacity: 0,
            transition: {
                duration: .5,
                ease: [0.175, 0.885, 0.32, 1.275]
            }
        }
    }

    const divider: Variants = {
        initial: {
            width: "0"
        },
        creation: {
            width: "100%",
            transition: {
                duration: .25
            }
        },
        exit: {
            y: "100vh"
        }
    }

    return (
        <AnimatePresence>

            {
                open &&
                <motion.div
                    initial={"initial"}
                    animate={"creation"}
                    exit={"exit"}
                    variants={variant}
                    className={styles["popover-action"]}
                    onClick={() => { setOpen(false) }}
                >

                    <motion.div
                        initial={"initial"}
                        animate={"creation"}
                        exit={"exit"}
                        variants={container}
                        className={styles["popover-action__container"]}>
                        <h1>{title}</h1>
                        <motion.hr
                            initial={"initial"}
                            animate={"creation"}
                            variants={divider}
                        />

                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>

    )
}

export default PopoverAction