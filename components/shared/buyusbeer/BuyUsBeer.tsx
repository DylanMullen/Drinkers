import React from 'react'
import { IoBeer } from 'react-icons/io5'

import styles from './beer-btn.module.scss'

type Props = {}

function BuyUsBeer({ }: Props)
{
    return (
        <a
            href="https://www.buymeacoffee.com/drinkers" target={"_blank"} rel="noreferrer"
            className={styles["beer-btn"]}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.blur()}
        >
            <h2 className={styles["beer-btn__text"]}>Buy us a drink!</h2>
            <span className={styles["beer-btn__btn"]}><IoBeer /></span>
        </a>
    )
}

export default BuyUsBeer