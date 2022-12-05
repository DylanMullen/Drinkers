import React, { useId, useState } from 'react'

import styles from './area-input.module.scss';

type Props = {
    label: string | ""
    placeholder?: string
    callback?: (message: string) => void
}

function AreaInput({ label = "", placeholder = "", callback = (mes: string) => { } }: Props)
{
    const [text, setText] = useState(placeholder)
    const id = useId()

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setText(() =>
        {
            callback(e.target.value)
            return e.target.value
        })
    }

    return (
        <div className={styles["input-textarea"]}>
            <label htmlFor={id}>{label}</label>
            <textarea name={id} id={id} defaultValue={text} onChange={onChange}/>
        </div>
    )
}

export default AreaInput