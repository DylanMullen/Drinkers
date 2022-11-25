import React, { useEffect, useState } from 'react'
import { deleteFirstPrompt, getFirstPrompt, newPrompt, selectPrompts } from 'redux/pirate/slice'
import { useAppDispatch, useAppSelector } from 'redux/store'
import PirateCard, { } from '../card/PirateCard'
import { v4 as uuid } from 'uuid';
import styles from './card-stack.module.scss'
import { AnimatePresence, motion, PanInfo, useMotionValue, usePresence, useTransform, Variants } from 'framer-motion';
import { PiratePrompt } from 'redux/pirate/types';
import { getPirateInstance } from 'services/pirate/game/PirateGameController';
import { getDefaultUser, getUser, User } from 'utils/UserUtil';

const DISTANCE_BETWEEN = 8
const DRAG_DISTANCE = 250

type StackedCardProps = {
    prompt: PiratePrompt,
    offset: number,
}

function PirateCardStack()
{
    const prompts = useAppSelector(selectPrompts)
    let keys = Object.keys(prompts)

    const cards: React.ReactNode[] = []

    for (let index = keys.length - 1; index >= 0; index--)
    {
        let promptID = keys[index]
        let prompt = prompts[promptID];
        cards.push(
            <StackedCard key={promptID} prompt={prompt} offset={index * DISTANCE_BETWEEN} />
        )
    }

    return (
        <div className={styles["stack"]}>
            <AnimatePresence>
                {/* {
                    keys.map((e, index) => )
                } */}
                {
                    cards
                }
            </AnimatePresence>

        </div>
    )

}

type AnimationAgruments = {
    prompt: PiratePrompt,
    offset: number,
    isFirst: boolean,
    direction: number,
    degreeModifier: number
}

const animationVariants: Variants = {
    "init": (args: AnimationAgruments) => ({
        y: `${args.offset * 2}px`,
        opacity: 0,
        rotate: args.prompt.rotation

    }),
    "animate": (args: AnimationAgruments) => ({
        y: `${args.offset}px`,
        opacity: 1,
        rotate: args.isFirst ? 0 : (args.prompt.rotation * args.degreeModifier),
        scale: 1,
        transition: {
            type: "spring",
            scale: {
                type: "spring",
                // duration: 0.15
            }
        }
    }),
    "expand": {
        scale: 1.15,
        transition: {
            type: "spring",
        }
    },
    "exit": (args: AnimationAgruments) => ({
        x: `${args.direction * (DRAG_DISTANCE + 100)}px`,
        opacity: 0,
        transition: {
            type: "spring",
        }
    })
}

function StackedCard({ prompt, offset }: StackedCardProps)
{
    const [user, setUser] = useState<User>(getDefaultUser())
    const [direction, setDirection] = useState(Math.random() >= .5 ? 1 : -1);
    const [expand, setExpand] = useState(true)
    const [degreeModifier] = useState<number>(Math.random() >= .5 ? 1 : -1)

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-DRAG_DISTANCE, 0, DRAG_DISTANCE], [-20, 0, 20], {
        clamp: false
    });

    const onDrag = (e: MouseEvent, info: PanInfo) =>
    {
        if (info.offset.x > DRAG_DISTANCE || info.offset.x < -DRAG_DISTANCE)
        {
            setDirection(info.offset.x > DRAG_DISTANCE ? 1 : -1)
            getPirateInstance().sendNextTurn(user.uuid)
        }
    }

    const onAnimationEnd = (e: string) =>
    {
        if (e === "expand")
            setExpand(false)
    }

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    let isFirst = offset === 0;
    let customProps: AnimationAgruments = {
        direction: direction,
        isFirst: isFirst,
        prompt: prompt,
        offset: offset,
        degreeModifier: degreeModifier
    }

    return (
        <motion.div
            className={styles["stack__card"]}
            variants={animationVariants}
            initial={["init"]}
            animate={["animate", offset === 0 && expand ? "expand" : ""]}
            exit="exit"
            custom={customProps}
            drag={isFirst && "x"}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onDragEnd={onDrag}
            whileHover={isFirst && !expand ? { scale: 1.025, cursor: "grab" } : {}}
            whileTap={isFirst ? { cursor: "grabbing", scale: 1.025 } : {}}
            onAnimationComplete={onAnimationEnd}
            style={{ x: x }}
        >
            <motion.div
                style={{ rotate: rotate }}
            >

                <PirateCard
                    settings={{
                        title: prompt.title,
                        description: prompt.description,
                        rotation: 0,
                        isDummy: offset !== 0
                    }}
                />
            </motion.div>


        </motion.div>
    )
}

export default PirateCardStack