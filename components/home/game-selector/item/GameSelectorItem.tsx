import Image from 'next/image'
import React, { useState } from 'react'

import styles from '../game-selector.module.scss'
import { FeaturedGame } from '../GameSelector';



function GameSelectorItem({ name, description, icon, color }: FeaturedGame)
{
    const [hover, setHovered] = useState(false);

    return (
        <li className={styles["selector-item"]} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={styles["selector-item__icon"]} style={{ color: hover ? color : "white" }}>
                {icon}
            </div>

            <div className={styles["selector-item__hover"]}>
                <h2 className={styles["selector-item__name"]}>{name}</h2>
                <p className={styles["selector-item__desc"]} >{description}</p>
                <button className={styles["selector-item__btn"]}>Play Now</button>
            </div>
        </li>
    )
}

export default GameSelectorItem