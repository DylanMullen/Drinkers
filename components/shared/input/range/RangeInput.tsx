import React, { useEffect, useId, useState } from 'react'

import styles from './rangeinput.module.scss';

type Props = {
    label: string,
    min?: number,
    max?: number,
    defValue?: number,
    disabled?: boolean
    changeCallback?: Function
}

function RangeInput({ label, min = 1, max = 2, defValue = 1, disabled = false, changeCallback = () => { } }: Props)
{
    const [value, setValue] = useState(defValue);
    const id = useId();

    label = label.replaceAll("%value", value + "");

    const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setValue(() =>
        {
            changeCallback(Number(e.target.value))
            return Number(e.target.value)
        })
    }

    useEffect(() =>
    {
        setValue(defValue)
    }, [defValue])

    return (
        <div className={styles["input-range"]}>
            <label htmlFor={`input-${id}`} className={styles["input-range__label"]}>{label}</label>
            <input disabled={disabled} id={`input-${id}`} className={styles["input-range__input"]} type="range" min={min} max={max} onChange={change} defaultValue={value} value={value} />
        </div>
    )
}

export default RangeInput