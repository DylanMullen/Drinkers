import React, { useState } from 'react'

import styles from './rangeinput.module.scss';

type Props = {
    label: string,
    min?: number,
    max?: number,
    defValue?: number
    changeCallback?:Function
}

function RangeInput({ label, min = 1, max = 2, defValue = 1, changeCallback = ()=>{} }: Props)
{
    const [value, setValue] = useState(defValue);

    label = label.replaceAll("%value", value + "");

    const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setValue(()=>{
            changeCallback(e.target.value)
            return Number(e.target.value)
        })
    }

    return (
        <div className={styles["input-range"]}>
            <label className={styles["input-range__label"]} htmlFor="">{label}</label>
            <input className={styles["input-range__input"]} type="range" min={min} max={max} onChange={change} defaultValue={defValue} />
        </div>
    )
}

export default RangeInput