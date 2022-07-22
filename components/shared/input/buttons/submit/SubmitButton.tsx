import React from 'react'
import { IoMdLogIn } from 'react-icons/io';

import styles from './btn-submit.module.scss';

type Props = {
    clickCallback?: Function,
    textColor?: string,
    text?: string
}

function SubmitButton({ clickCallback = () => { }, textColor = "black", text = "Let's Go" }: Props)
{

    const click = () => { clickCallback() }

    return (
        <button className={styles["btn-submit"]} onClick={click}
            style={{ color: textColor }}>
            {text}
            <span className={styles["btn-submit__icon"]}>
                <IoMdLogIn />
            </span>
        </button>
    )
}

export default SubmitButton