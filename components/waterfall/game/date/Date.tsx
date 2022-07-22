import Image from 'next/image';
import React, { useState } from 'react'
import { getWaterfallPlayerByUUID } from 'redux/waterfall/slice';
import { WaterfallDate, WaterfallPlayer } from 'redux/waterfall/types'

import styles from './date.module.scss';

type Props = {
    owner: WaterfallPlayer,
    showDates: boolean,
    dates: WaterfallPlayer[],
    clickCallback?: Function
}

type DateIconProps = {
    player: WaterfallPlayer
}

function Date({ owner, dates, showDates = true, clickCallback }: Props)
{

    let dateIcons = showDates ? getDates(dates) : undefined;

    const click = () => { clickCallback && clickCallback() }

    return (
        <div className={styles["waterfall-date"] + " " + (clickCallback ? styles["waterfall-date--click"] : "")}
            onClick={click}
        >
            <ul className={styles["waterfall-date__dates"]}>
                {dateIcons &&
                    dateIcons
                }
            </ul>
            <div className={styles["waterfall-date__avatar"]}>
                <Image src={owner.avatar} alt={"Avatar of " + owner.username} width={"100%"} height={"100%"} />
            </div>
            <span className={styles["waterfall-date__name"]}>{owner.username}</span>
        </div>
    )
}

function DateIcon({ player }: DateIconProps)
{
    const [isHovered, setHovered] = useState(false);

    return (
        <li className={styles["waterfall-date__dates__icon"]}
            onMouseEnter={() => setHovered(prev => true)}
            onMouseLeave={() => setHovered(prev => false)}
        >
            <Image src={player.avatar} width="100%" height={"100%"} alt={"Date icon of " + player.username} />
            {
                isHovered &&
                <span className={styles["waterfall-date__dates__tooltip"]}>{player.username}</span>
            }
        </li>
    )
}

function getDates(dates: WaterfallPlayer[]): React.ReactNode[]
{
    return dates.map((date, index) =>
    {
        return <DateIcon key={index} player={date} />
    })
}

export default Date