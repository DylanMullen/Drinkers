import React from 'react'

import styles from './menuoption.module.scss';

type Props = {
    text: string,
    icon: React.ReactNode,
    modifier: string
    callback?: Function
}

function MenuOption({ callback = () => { }, text, modifier, icon }: Props)
{

    const click = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        callback(e);
    }

    const clazz: string = styles["waterfall-menuoption"] + " " + styles["waterfall-menuoption--" + modifier]

    return (
        <button className={clazz} onClick={click}>
            <div className={styles["waterfall-menuoption__icon"]}>
                {icon}
            </div>
            <span className={styles["waterfall-menuoption__text"]}
            >
                {text}
            </span>
            <div className={styles["waterfall-menuoption__highlight"]} />
        </button>
    )
}

export default MenuOption