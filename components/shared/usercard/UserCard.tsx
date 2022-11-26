import Image from 'next/image';
import React, { useState } from 'react';
import { useAppSelector } from 'redux/store';
import { selectGame } from 'redux/waterfall/slice';

import styles from './usercard.module.scss';

import { getCookie } from 'cookies-next';
import { IoMdCheckmarkCircleOutline, IoMdClose as CloseIcon } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { getCurrentGame } from 'services/waterfall/GameController';
import { User } from 'utils/UserUtil';

type UserProps = {
    user: User,
    settings?: {
        dummy?: boolean
        shouldPulse?: boolean
        clickHandler?: Function,
    }
}

function UserCard(
    {
        user,
        settings: { dummy, shouldPulse, clickHandler } = {
            dummy: false,
            shouldPulse: false,

        }
    }: UserProps

)
{
    const [isHovered, setHovered] = useState(false);
    return (
        <div className={`${styles["usercard__wrapper"]} ${shouldPulse ? styles["usercard--next"] : ""}`}>
            <div className={styles["usercard"]}>
                <div className={styles["usercard__avatar"]}
                    onMouseEnter={() => setHovered(prev => !prev)}
                    onMouseLeave={() => setHovered(prev => !prev)}
                >
                    {
                        isHovered && clickHandler !== undefined &&
                        < button className={styles["usercard__admin"]} onClick={() => clickHandler()}><IoClose /></button>
                    }
                    <Image src={user.avatar} width="100%" height="100%" alt={`Avatar of ${user.username}`} />
                </div>
                <span className={styles["usercard__name"]}>{user.username}</span>
            </div>
        </div>
    )
}



export default UserCard