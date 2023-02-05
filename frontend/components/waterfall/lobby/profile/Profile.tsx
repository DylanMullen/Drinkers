import { useModalContext } from 'context/ModalContext'
import Image from 'next/image'
import React from 'react'
import ProfileModal from '../modals/profile'

import styles from './profile.module.scss'

type Props = {
    username: string,
    avatar: string | undefined,
    showHelper?: boolean,
}

function Profile({ username, avatar, showHelper = true }: Props)
{
    const { update, open, close } = useModalContext();

    const openProfileModal = () =>
    {
        update(<ProfileModal close={close} />)
        open()
    }

    return (
        <div className={styles["waterfall-profile"]}>
            <div className={styles["waterfall-profile__avatar"]}>
                <Image src={avatar ?? ""} width={"100%"} height={"100%"} alt={`Your Avatar`} />
            </div>
            <div className="waterfall-profile__body">
                <h1 className={styles["waterfall-profile__title"]}>{username}</h1>
                {
                    showHelper &&
                    <button
                        onClick={openProfileModal}
                        className={styles["waterfall-profile__subtitle"]}>Not you?</button>
                }
            </div>
        </div>
    )
}

export default Profile