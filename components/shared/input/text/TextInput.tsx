import React, { useState } from 'react'

import styles from './textinput.module.scss';

type Props = {
    label: string,
    password?: boolean
    placeholder?: string,
    retriever?: Function,
}

function TextInput({ retriever, label, password = false, placeholder = "" }: Props)
{
    const [value, setValue] = useState(placeholder);

    const textChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setValue(() =>
        {
            if (retriever !== undefined)
                retriever(e.target.value)
            return e.target.value
        })
    }


    return (
        <div className={styles["input-text"]}>
            <label className={styles["input-text__label"]}>{label}</label>
            <input className={styles["input-text__input"]} type={password ? "password" : "text"}
                value={value} placeholder={placeholder} onChange={textChange} />
        </div>
    )
}

export default TextInput