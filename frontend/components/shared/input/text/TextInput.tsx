import React, { useEffect, useId, useState } from 'react'

import styles from './textinput.module.scss';

type Props = {
    label: string,
    password?: boolean
    placeholder?: string,
    value?: string,
    retriever?: (mes: string) => void,
}

function TextInput({ retriever = (mes: string) => { }, label, password = false, placeholder = "", value }: Props)
{
    const [text, setValue] = useState(placeholder);
    const id = useId();

    const textChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (value !== undefined)
        {
            retriever(e.target.value)
            return;
        }
        setValue(() =>
        {
            if (retriever !== undefined)
                retriever(e.target.value)
            return e.target.value
        })
    }


    return (
        <div className={styles["input-text"]}>
            <label htmlFor={`input-${id}`} className={styles["input-text__label"]}>{label}</label>
            <input id={`input-${id}`} className={styles["input-text__input"]} type={password ? "password" : "text"}
                value={value ?? text} placeholder={placeholder} onChange={textChange} />
        </div>
    )
}

export default TextInput