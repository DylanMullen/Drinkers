import useUser from 'context/UserContext';
import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getHigherLowerInstance } from 'services/hi-lo/game/HiLoGameController';

import styles from './hilo-card.module.scss';

type Props = React.PropsWithChildren & {
    showButtons?: boolean,
    callback?: () => void
}

function HiLoCard({ showButtons = false, callback = () => { }, children }: Props)
{
    const { user } = useUser();


    const action = (action: "higher" | "lower", e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        if (!user) return;
        getHigherLowerInstance().sendNextTurn(action, user.uuid ?? "")
        callback()
    }

    return (
        <div className={styles["hilo-card"]}>

            <div className={styles["hilo-card__card"]}>
                {children}
            </div>

            {
                showButtons &&
                <div className={styles["hilo-card__controls"]}>
                    <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--higher"]}`} onClick={e => action("higher", e)}>
                        <FaChevronUp />
                    </button>
                    <button className={`${styles["hilo-card__btn"]} ${styles["hilo-card__btn--lower"]}`} onClick={e => action("lower", e)}>
                        <FaChevronDown />
                    </button>
                </div>
            }
        </div>
    )
}

export default HiLoCard