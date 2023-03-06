import ProfileEditor from 'components/waterfall/lobby/profile-editor'

import {motion, Variants} from 'framer-motion'
import { useModalContext } from 'context/ModalContext'
import React, { MouseEvent, MouseEventHandler } from 'react'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import { URL } from 'settings/Config'

import styles from './invite-modal.module.scss'
import { IoClose } from 'react-icons/io5'
import { getHigherLowerInstance } from 'services/hi-lo/game/HiLoGameController'

type Props = {}

const variants:Variants = {
    "init": {
        scale: 0.5,
        translateY: "5rem"
    },
    "animate": {
        scale: 1,
        translateY: "0rem",
        transition: {
            scaleX: {
                duration: .15
            },
            translateY:{
                duration: .25,
                ease: "easeInOut"
            }
        }
    }
}

function InviteModal({ }: Props)
{
    const {close} = useModalContext();
    const settings = useAppSelector(HiLoSelectors.settings);

    const copy = (e:MouseEvent<HTMLButtonElement>)=>{
        e.currentTarget.blur();
        navigator.clipboard.writeText(URL + "/waterfall/game?code=" + settings.joinCode)
        close()
    }

    const addBot = (username:string, avatar:string, uuid:string)=>{
        getHigherLowerInstance().sendBotRequest("", {uuid, avatar,username, highestStreak: 0, streak: 0, bot:true})
        close()
    }

    return (
        <motion.div className={styles["invite-modal"]} onClick={e=>e.stopPropagation()} variants={variants} initial={"init"} animate="animate">
            {/* <button className={styles["invite-modal__close"]} onClick={close}><IoClose /></button> */}
            
            <section className={styles["invite-modal__invite"]}>
                <h1 className={styles["invite-modal__title"]}>Invite Your Friends</h1>
                <button className={styles["invite-modal__invite-btn"]} onClick={copy}>Copy Link</button>
            </section>
            <section className={styles["invite-modal__bot"]}>
                <h1 className={styles["invite-modal__title"]}>Add A Bot</h1>
                <div className={styles["invite-modal__bot-creator"]}>
                    <ProfileEditor 
                        callback={addBot}
                        hydrate={false}
                        text="Add Bot"
                    />
                </div>
            </section>
        </motion.div>
    )
}

export default InviteModal