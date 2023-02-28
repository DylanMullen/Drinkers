import useUser from 'context/UserContext';
import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getHigherLowerInstance } from 'services/hi-lo/game/HiLoGameController';

import styles from './hilo-card.module.scss';

type Props = React.PropsWithChildren & {
    showButtons?: boolean,
    showCard?: boolean
    callback?: () => void
}

function HiLoCard({ showButtons = false, showCard = true, callback = () => { }, children }: Props)
{
    const { user } = useUser();


    const action = (action: "higher" | "lower", e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        getHigherLowerInstance().sendNextTurn(action, user?.uuid ?? "")
        callback()
    }

    return (
        <div className={styles["hilo-card"]}>
            {
                showButtons &&
                <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--higher"]}`} onClick={e => action("higher", e)}>
                    <FaChevronUp />
                    <span className={`${styles["hilo-card__btn__text"]}`}>Higher</span>

                </button>
            }

            <div className={styles["hilo-card__card"]}>
                {children}
            </div>

            {
                showButtons &&
                <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--lower"]}`} onClick={e => action("lower", e)}>
                    <FaChevronDown />
                    <span className={`${styles["hilo-card__btn__text"]}`}>Lower</span>
                </button>
            }
        </div>
    )
}

export default HiLoCard