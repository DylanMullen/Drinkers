import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import styles from './hilo-card.module.scss';

type Props = React.PropsWithChildren & {
    showButtons?: boolean
}

function HiLoCard({ showButtons, children }: Props)
{
    const higher = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
    }

    const lower = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
    }

    return (
        <div className={styles["hilo-card"]}>
            {
                showButtons &&
                <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--higher"]}`} onClick={higher}>
                    <FaChevronUp />
                </button>
            }

            <div className={styles["hilo-card__card"]}>
                {children}
            </div>

            {
                showButtons &&
                <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--lower"]}`} onClick={lower}>
                    <FaChevronDown />
                </button>
            }
        </div>
    )
}

export default HiLoCard