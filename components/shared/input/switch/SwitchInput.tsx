import React, { useEffect, useId, useState } from 'react'

import styles from './switchinput.module.scss'

type Props = {
    label: string,
    disabled?: boolean,
    defaultValue?:boolean,
    changeCallback?: Function
}

function SwitchInput({ label, disabled = false, defaultValue = true, changeCallback = () => { } }: Props)
{

    const [isChecked, setChecked] = useState(defaultValue);
    const id = useId();

    const onChange = () =>
    {
        if (disabled)
            return;

        setChecked(prev =>
        {
            changeCallback(!prev)
            return !prev
        })
    };

    useEffect(()=>{
        setChecked(defaultValue);
    },[defaultValue])

    return (
        <div className={styles["input-switch"]}>
            <label htmlFor={`input-${id}`} className={styles["input-switch__label"]}>{label}</label>

            <div className={styles["input-switch__container"]}>
                <input id={`input-${id}`} type="checkbox" className={styles["input-switch__input"]} onChange={() => { }} checked={isChecked} />
                <span className={styles["input-switch__slider"]} onClick={onChange} />
            </div>
        </div>
    )
}

export default SwitchInput