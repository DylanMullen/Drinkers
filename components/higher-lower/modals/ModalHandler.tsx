import { useModalContext } from 'context/ModalContext';
import React, { useEffect } from 'react'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import NextTurn from './next-turn';

import styles from './modal-handler.module.scss'
import { DEBUG } from 'settings/Config';
import InviteModal from './invite';
import PromptModal from './prompt';
import useUser, { dummy } from 'context/UserContext';

type Props = {}



function ModalHandler({ }: Props)
{
    const nextPlayer = useAppSelector(HiLoSelectors.nextUser);
    const { open, update, close } = useModalContext();

    const { user } = useUser()

    useEffect(() =>
    {
        let user = HiLoSelectors.getUser(nextPlayer)
        if (!user) return;

        close()
        update(<NextTurn username={user.username} callbacks={{ end: () => close() }} />, false)
        setTimeout(() =>
        {

            new Audio("/nextPlayer.mp3").play()
        }, 500)
        open()
    }, [nextPlayer])

    const nextTurn = () =>
    {
        update(<NextTurn username={"DEBUG"} callbacks={{ end: () => close() }} />, false)
        open()
    }
    const invite = () =>
    {
        update(<InviteModal />)
        open()
    }

    const prompts = () =>
    {
        update(
            <PromptModal
                promptOwner={user ?? dummy}
                text={{
                    title: "Diamond in the rough",
                    description: `In what way do you think you're better than most people?`
                }}
            />,
            false
        )
        open()

    }
    return (
        <>
            {
                DEBUG &&
                <div className={styles["debug-panel"]}>
                    <h1 className={styles["debug-panel__title"]}>Debug</h1>
                    <div className={styles["debug-panel__buttons"]}>

                        <button className={styles["debug-panel__btn"]} onClick={nextTurn}>Next Turn</button>
                        <button className={styles["debug-panel__btn"]} onClick={invite}>Invite</button>
                        <button className={styles["debug-panel__btn"]} onClick={prompts}>Prompts</button>
                    </div>
                </div>
            }
        </>
    )
}

export default ModalHandler