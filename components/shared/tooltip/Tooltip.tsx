import React from 'react'

import styles from './tooltip.module.scss'

type Props = {
    children: React.ReactNode,
    text: string
    direction: "left" | "right"
}

function Tooltip({ children, text, direction = "right" }: Props)
{
    return (
        <div className={styles["tooltip__wrapper"]}>
            <div className={`${styles["tooltip"]} ${styles["tooltip--" + direction]}`}>{text}</div>
            {children}
        </div>
    )
}

export default Tooltip