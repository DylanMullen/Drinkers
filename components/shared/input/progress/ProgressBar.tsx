import React from 'react'

import styles from './progress-bar.module.scss'

type Props = {
    label?: string,
    scheme?: CustomColours
    progress: number
}

type CustomColours = {
    innerColour?: string,
    outerColour?: string,
    labelAlign?: CanvasTextAlign
}

function ProgressBar({ label, scheme, progress = 0 }: Props)
{
    return (
        <div className={styles["progressbar"]}>
            {
                label &&
                <label className={styles["progressbar__label"]} style={{textAlign: scheme?.labelAlign ?? undefined}}>{label}</label>
            }
            <div className={styles["progressbar__outer"]} style={scheme ? { background: scheme.outerColour } : undefined}>
                <div className={styles["progressbar__inner"]} style={{ width: `${progress}%`, background: scheme?.innerColour }} />
            </div>
        </div>
    )
}

export default ProgressBar