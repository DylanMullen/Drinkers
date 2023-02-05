import Image from 'next/image'
import React from 'react'
import { useState } from 'react'
import { useAppSelector } from 'redux/store'
import { getWaterfallDates, getWaterfallPlayerByUUID, selectGame } from 'redux/waterfall/slice'
import { WaterfallDate } from 'redux/waterfall/types'

import { getCookie } from 'cookies-next';


import styles from './userstatus.module.scss'

type Props = {
    username: string,
    uuid: string
}

type ItemProps = {
    icon: string,
    iconImage?: React.ReactNode
    tooltip: string
}

function UserStatusBar({ username, uuid }: Props)
{
    let statusItems: React.ReactNode[] = []

    let clientCookie = getCookie("user");
    let clientUUID = clientCookie !== undefined ? JSON.parse(clientCookie as string).uuid : ""

    let { ownerId, players, mechanics } = useAppSelector(selectGame);
    let dates = getWaterfallDates(uuid);

    if (ownerId === uuid)
        statusItems.push(<UserStatusItem icon="👑" tooltip="Room Owner" />)
    if (players.next === uuid)
        statusItems.push(<UserStatusItem icon="🕒" tooltip="Next Turn" />)
    if (mechanics.thumbMaster === uuid)
        statusItems.push(<UserStatusItem icon="👍" tooltip="Thumb Master" />)

    statusItems.push(getDates(dates, clientUUID, username))

    return (
        <ul className={styles["userstatus"]}>
            {statusItems}
        </ul>
    )
}

function UserStatusItem({ icon, iconImage, tooltip }: ItemProps)
{
    const [isHovered, setHovered] = useState(false);



    return (
        <li className={styles["userstatus__item"]}
            onMouseEnter={() => setHovered(prev => !prev)}
            onMouseLeave={() => setHovered(prev => !prev)}>
            <div className={styles["userstatus__item__icon"]}>
                {iconImage !== undefined ? iconImage :
                    <span>{icon}</span>
                }
            </div>
            {
                isHovered &&
                <span className={styles["userstatus__item__tooltip"]}>
                    {tooltip}
                </span>
            }
        </li>
    )
}

function getDates(dates: WaterfallDate[], clientUUID: string, username: string)
{
    let response: React.ReactNode[] = []
    for (let x = 0; x < dates.length; x++)
    {
        const date = dates[x];
        let owner = getWaterfallPlayerByUUID(date.owner);
        let isClientOwner = owner ? owner.uuid === clientUUID : false;
        let isClient = date.date === clientUUID;


        let avatar = owner ? owner.avatar : "";
        let tooltip = (isClientOwner ? "You are dating " : owner?.username + " is dating ") + (isClient ? "you" : username)

        response.push(
            <UserStatusItem icon=""
                iconImage={<Image src={avatar} width={"100%"} height={"100%"} alt={`Avatar of ${owner?.username ?? ""}`} />}
                tooltip={tooltip} />)
    }

    return response;
}

export default UserStatusBar