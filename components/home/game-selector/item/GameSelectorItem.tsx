import { motion, Variants } from 'framer-motion';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'

import styles from '../game-selector.module.scss'
import { FeaturedGame } from '../GameSelector';

type Props = FeaturedGame & {
    delay: number,
}

function GameSelectorItem({ name, description, icon, color, link, disabled }: Props)
{
    const [hover, setHovered] = useState(false);

    return (
        <li
            className={styles["selector-item"]}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={styles["selector-item__icon"]} style={{ color: hover ? color : "white" }}>
                {icon}
            </div>

            <div className={styles["selector-item__hover"]}>
                <h2 className={styles["selector-item__name"]}>{name}</h2>
                <p className={styles["selector-item__desc"]} >{description}</p>
                {
                    disabled ?
                        <span className={`${styles["selector-item__btn"]} ${disabled ? styles["selector-item__btn--disabled"] : ""}`}>{!disabled ? "Play Now" : "Coming Soon!"}</span>
                        :
                        <Link href={link} unselectable={disabled ? "off" : "on"}>
                            <span className={`${styles["selector-item__btn"]} ${disabled ? styles["selector-item__btn--disabled"] : ""}`}>{!disabled ? "Play Now" : "Coming Soon!"}</span>
                        </Link>

                }
            </div>
        </li>
    )
}

export default GameSelectorItem