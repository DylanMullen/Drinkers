import React, { useId, useState } from 'react'

import styles from './switchinput.module.scss'

type Props = {
    label: string,
    changeCallback?: Function
}

function SwitchInput({ label, changeCallback = () => { } }: Props)
{

    const [isChecked, setChecked] = useState(false);
    const id = useId();

    const onChange = () =>
    {
        setChecked(prev => {
            changeCallback(!prev)
            return !prev
        })
    };

    return (
        <div className={styles["input-switch"]}>
            <label htmlFor={`input-${id}`} className={styles["input-switch__label"]}>{label}</label>

            <div className={styles["input-switch__container"]}>
                <input id={`input-${id}`} type="checkbox" className={styles["input-switch__input"]} checked={isChecked} />
                <span className={styles["input-switch__slider"]} onClick={onChange} />
            </div>
        </div>
    )
}

export default SwitchInput