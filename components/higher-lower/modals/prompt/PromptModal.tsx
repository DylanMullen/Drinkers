import Avatar from 'components/higher-lower/avatar'
import TextPrompt from 'components/higher-lower/prompts/text'
import { useModalContext } from 'context/ModalContext'
import useUser from 'context/UserContext'
import { Variants, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { User } from 'utils/UserUtil'

import styles from './prompt-modal.module.scss'

type Props = {
    promptOwner: User,
    timeOut?: number
    text: {
        title: string,
        description: string
    }
}

const variants: Variants = {
    "init--container": {
        translateY: "5rem",
        translateX: "-50%",
    },
    "init--title": {
        clipPath: "polygon(50% 100%,50% 0%,50% 0%,50% 100%)",
    },
    "init--description": {
        translateY: "-100%"
    },
    "init--avatar": {
        scale: 0,
        rotateZ: "35deg"
    },
    "animate--container": {
        translateY: "0rem",
        transition: {
            // duration: .25
        }
    },
    "animate--title": {
        clipPath: "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)",
        transition: {
            clipPath: {
                duration: .5
            },
        }
    },
    "animate--description": {
        translateY: "0%",
        transition: {
            delay: .5,
            translateY: {
                duration: 0.25
            }
        }
    },
    "animate--avatar": {
        scale: 1,
        rotateZ: ["45deg", "0deg"],
        transition: {
            duration: 0.25,
            rotateZ: {
                duration: .3
            }
        }
    },
    "exit--title": {
        clipPath: "polygon(50% 100%,50% 0%,50% 0%,50% 100%)",
        transition: {
            delay: .25,
            clipPath: {
                duration: .5
            },
        }
    },
    "exit--description": {
        translateY: "-100%",
        transition: {
            translateY: {
                duration: 0.25
            }
        }
    },
    "exit--avatar": {
        scale: 0,
        rotateZ: "35deg",
        transition: {
            duration: 0.25,
            delay: 0.45,
            rotateZ: {
                duration: .3
            }
        }
    }
}


function PromptModal({ promptOwner, timeOut, text: { title, description } = { title: "", description: "" } }: Props)
{
    const { close, update } = useModalContext()
    const [shouldEnd, setShouldEnd] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() =>
    {
        if (!shouldEnd) return;

        setTimeout(() =>
        {
            setShow(false)
            setTimeout(() =>
            {
                update(undefined)
                close()
            }, 1000)
        }, timeOut ?? 1000)

    }, [shouldEnd])

    return (
        <motion.div className={styles["prompt-modal"]}
            variants={variants} initial="init--container" animate="animate--container" exit="init--container"
        >
            <AnimatePresence>
                {
                    show &&
                    <motion.div className={styles["prompt-modal__avatar"]}
                        variants={variants} initial="init--avatar" animate="animate--avatar" exit={"exit--avatar"}
                    >
                        <Avatar user={promptOwner} />
                    </motion.div>
                }
            </AnimatePresence>

            <div className={styles["prompt-modal__content"]}>
                <AnimatePresence>

                    {
                        show &&
                        <motion.h1 className={styles["prompt-modal__title"]}
                            variants={variants} initial="init--title" animate="animate--title" exit="exit--title"
                        >
                            {title}
                        </motion.h1>
                    }
                </AnimatePresence>
                <div className={styles["prompt-modal__description__wrapper"]}>
                    <AnimatePresence>

                        {
                            show &&
                            <motion.p className={styles["prompt-modal__description"]}
                                variants={variants} initial="init--description" animate="animate--description" exit="exit--description"
                                onAnimationComplete={() => setShouldEnd(true)}
                            >
                                {description}
                            </motion.p>
                        }
                    </AnimatePresence>
                </div>
            </div>

        </motion.div>
    )
}

export default PromptModal