import PirateCard from 'components/pirate/game/card';
import useCreatorContext, { PromptType } from 'context/drunkcards/creator/CreatorContext'
import React, { useEffect } from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

import styles from './prompt-item.module.scss';

type Props = {
    prompt: PromptType
}

function PromptItem({ prompt }: Props)
{
    const { updateCurrent, removePrompt } = useCreatorContext();


    const edit = () =>
    {
        updateCurrent(prompt);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deletePrompt = () => removePrompt(prompt.settings.uuid)

    return (
        <div className={styles["prompt-item"]}>
            <div className={styles["prompt-item__buttons"]}>
                <button
                    className={`${styles["prompt-item__btn"]} ${styles["prompt-item__btn--edit"]}`}
                    onClick={edit}>
                    <FiEdit />
                </button>
                <button
                    className={`${styles["prompt-item__btn"]} ${styles["prompt-item__btn--delete"]}`}
                    onClick={deletePrompt}>
                    <FiTrash2 />
                </button>
            </div>
            <PirateCard
                settings={{ ...prompt.settings, isDummy: true }}
                scheme={prompt.scheme}
            />
        </div>
    )
}

export default PromptItem