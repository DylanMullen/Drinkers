import Image from 'next/image'
import React from 'react'

import styles from './profile.module.scss'

type Props = {
    username: string,
    avatar: string | undefined,
    showHelper?: boolean,
    open?: React.MouseEventHandler<HTMLButtonElement>
}

function Profile({ username, avatar, showHelper = true, open = () => { } }: Props)
{
    return (
        <div className={styles["waterfall-profile"]}>
            <div className={styles["waterfall-profile__avatar"]}>
                <Image src={avatar ?? ""} width={"100%"} height={"100%"} alt={`Your Avatar`} />
            </div>
            <div className="waterfall-profile__body">
                <h1 className={styles["waterfall-profile__title"]}>{username}</h1>
                {
                    showHelper && open &&
                    <button
                        onClick={open}
                        className={styles["waterfall-profile__subtitle"]}>Not you?</button>
                }
            </div>
        </div>
    )
}

export default Profile