import React, { useState } from 'react'

import styles from './control-btn.module.scss';

type Props = {
    icon: any,
    text: string,
    callback?: Function
    disabled?: boolean
}

function ControlButton({ icon, text, callback, disabled = false }: Props)
{
    const [hasHover, setHover] = useState(false);

    const hover = () => setHover(() => true);
    const hide = () => setHover(() => false)

    const click = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        if (callback !== undefined) callback(e)

        e.currentTarget.blur();
        hover();
    };

    return (
        <>
            <div className={styles["waterfall-controls"]}
                onMouseEnter={hover} onMouseLeave={hide}>
                <button className={styles["waterfall-controls__btn"]}
                    onFocus={hover} onBlur={hide} disabled={disabled}
                    onClick={click}>{icon}
                    {
                        hasHover &&
                        <div className={styles["waterfall-controls__tooltip"]}>
                            <span className={styles["waterfall-controls__tooltip__text"]}>
                                {text}
                            </span>
                        </div>
                    }

                </button>
            </div>
        </>
    )
}

export default ControlButton