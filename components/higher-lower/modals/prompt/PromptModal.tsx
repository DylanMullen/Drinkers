import useUser from 'context/UserContext'
import React from 'react'

import styles from './prompt-modal.module.scss'

type Props = {}

function PromptModal({ }: Props)
{

    const { user } = useUser()

    return (
        <div className={styles["prompt-modal"]}>
        </div>
    )
}

export default PromptModal