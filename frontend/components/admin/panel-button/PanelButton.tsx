import React from 'react'

import styles from './panelbtn.module.scss'

type Props = {
    text: string,
    icon: React.ReactNode
    callback?: () => void
    scheme?: CustomScheme
}

type CustomScheme = {
    bg: string,
}

function PanelButton({ text, icon, callback = () => { }, scheme }: Props)
{

    const click = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur();
        callback();
    }

    return (
        <button className={styles["panelbtn"]} onClick={click}>
            <div className={styles["panelbtn__icon"]}>{icon}</div>
            <h1 className={styles["panelbtn__text"]}>{text}</h1>
        </button>
    )
}

export default PanelButton