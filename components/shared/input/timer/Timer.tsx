import React, { useEffect, useState } from 'react'

import styles from './timer.module.scss'

type Props = {
    maxTime: number,
    callback: Function
}

function Timer({ maxTime = 5, callback = () => { } }: Props)
{
    const [time, setTime] = useState(0);

    const test = () => { console.log("test") }

    useEffect(() =>
    {
        let id = setInterval(() =>
        {
            if (time + .5 > maxTime)
                return;

            setTime(prev =>
            {
                if (prev + .5 === maxTime)
                    callback()
                return prev + .5
            })
        }, 500)

        return () => { clearInterval(id) }
    }, [])

    const percentage = (time / maxTime) * 100

    const status = percentage <= 25 ? 0 : percentage <= 50 ? 1 : percentage <= 75 ? 2 : 3

    return (
        <div className={styles["timer"]}>
            <span className={styles["timer__slider"]}
                style={{ width: percentage + "%" }} 
                data-status={status}
                />
        </div>
    )
}

export default Timer