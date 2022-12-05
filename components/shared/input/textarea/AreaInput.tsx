import React, { useId, useState } from 'react'

import styles from './area-input.module.scss';

type Props = {
    label: string | ""
    placeholder?: string
    value?: string
    callback?: (message: string) => void
}

function AreaInput({ label = "", placeholder = "", value, callback = (mes: string) => { } }: Props)
{
    const [text, setText] = useState(placeholder)
    const id = useId()

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        if (value !== undefined)
        {
            callback(e.target.value)
            return;
        }
        setText(() =>
        {
            callback(e.target.value)
            return e.target.value
        })
    }
    return (
        <div className={styles["input-textarea"]}>
            <label htmlFor={id}>{label}</label>
            <textarea name={id} id={id} value={value ?? text} onChange={onChange} />
        </div>
    )
}

export default AreaInput