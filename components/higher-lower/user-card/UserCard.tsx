import Image from 'next/image'
import React from 'react'
import { User } from 'utils/UserUtil'

import styles from './user-card.module.scss'

type Props = {
    user: User | undefined,
    selected?:boolean
}

function UserCard({ user, selected = false }: Props)
{
    return (
        <>
            {
                user &&
                <div className={`${styles["user-card"]} ${selected ? styles["user-card--selected"] : ""}`}>
                    <div className={styles["user-card__avatar"]}>
                        <Image src={user.avatar} width="100%" height="100%" alt={`Avatar of ${user.username}`} />
                    </div>
                    <div className={styles["user-card__content"]}>
                        <span className={styles["user-card__username"]}>{user.username}</span>
                    </div>
                </div>
            }

        </>
    )
}

export default UserCard