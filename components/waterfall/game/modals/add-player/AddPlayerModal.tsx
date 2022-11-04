import Modal from 'components/shared/modal'
import ProfileEditor from 'components/waterfall/lobby/profile-editor'
import React from 'react'
import { BsEnvelope } from 'react-icons/bs'
import { FaLink } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { getCurrentGame } from 'services/waterfall/GameController'

import { URL } from 'settings/Config';


import styles from './addplayer-modal.module.scss'

type Props = {
    close: Function
}

function AddPlayerModal({ close }: Props)
{
    const copyLink = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        let url = URL + "/waterfall/" + getCurrentGame().gameCode + "/";

        navigator.clipboard.writeText(url)
    }

    const addPlayer = (username: string, avatar: string, uuid: string) =>
    {
        getCurrentGame().sendOfflinePlayerRequest({ username, avatar, uuid, offline: true })
        close();
    }


    return (
        <Modal
            closeBtn
            closeClbck={close}
            customColors={{
                accent: "linear-gradient(-180deg, rgba(247,157,101,1) 0%, rgba(242,112,89,1) 57%, rgba(242,92,84,1) 100%)",
                icon: "#f79d65",
                text: "white"
            }}
            icon={<FiUser />}
        >
            <div className={styles["add-player"]}>
                <section className={styles["add-player__offline"]}>
                    <h1 className={styles["add-player__title"]}>Add an Offline Player</h1>
                    <ProfileEditor
                        hydrate={false}
                        callback={addPlayer}
                        text="Add Player"
                    />
                </section>
                <div className={styles["add-player__seperator"]}>
                    <hr />
                    <span>Or</span>
                    <hr />
                </div>
                <section className={styles["add-player__other"]}>
                    <h1 className={styles["add-player__title"]}>Invite your Friends</h1>
                    <button className={styles["add-player__link"]} onClick={copyLink}>
                        <FaLink />
                    </button>
                </section>
            </div>
        </Modal>
    )
}

export default AddPlayerModal