import Image from 'next/image'
import React from 'react'
import { User } from 'utils/UserUtil'

import styles from './avatar.module.scss'

type Props = {
    user:User

}

function Avatar({ user }: Props)
{
    return (
        <div className={styles["avatar__wrapper"]}>
            <div className={styles["avatar__image"]}>
                <Image src={user.avatar} width="100%" height="100%" layout='responsive' />
            </div>
            <span className={styles["avatar__username"]}>{user.username}</span>
        </div>

    )
}

export default Avatar