import React from 'react'

import styles from './text-prompt.module.scss'

type Props = {
    title: string,
    description: string
}

function TextPrompt({ title, description }: Props)
{
    return (
        <div className={styles["text-prompt"]}>
            <span className={styles["text-prompt__title"]}>{title}</span>
            <p className={styles["text-prompt__description"]}>{description}</p>
        </div>
    )
}

export default TextPrompt