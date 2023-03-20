import SubmitButton from 'components/shared/input/buttons/submit';
import TextInput from 'components/shared/input/text';
import Modal from 'components/shared/modal'
import AdModal from 'components/shared/modals/ad';
import { useModalContext } from 'context/ModalContext';
import useUser from 'context/UserContext';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { CgProfile as ProfileIcon } from 'react-icons/cg';
import { HiLoController } from 'services/hi-lo/game/HiLoGameController';
import { joinPirateGame } from 'services/pirate/game/PirateGameController';
import { getCurrentGame, joinWaterfallGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';
import Profile from '../../profile';

import styles from './join-modal.module.scss'

type Props = {
    close: Function
    gameMode: GameMode,
    joinCallback?: () => void
}
export enum GameMode
{
    WATERFALL = "waterfall",
    DRUNKCARDS = "drunkcards",
    HIGHER_LOWER = "higher-lower"
}

export type Error = {
    message: string
}

function JoinModal({ close, gameMode, joinCallback = () => { } }: Props)
{
    const router = useRouter();
    const { update } = useModalContext()
    const { user } = useUser();

    const [error, setError] = useState<Error>();

    const [joinCode, setJoinCode] = useState("");

    const click = () =>
    {
        const callback = async () =>
        {
            if (!user)
                return;

            let error

            switch (gameMode)
            {
                case GameMode.WATERFALL:
                    error = await joinWaterfallGame({ joinCode: joinCode, player: user })
                    break;
                case GameMode.DRUNKCARDS:
                    error = await joinPirateGame(joinCode, user)
                    break;
                case GameMode.HIGHER_LOWER:
                    error = await HiLoController.join(user, joinCode)
                    break;
            }
            router.push(`/${gameMode}/game?code=${joinCode}`, undefined, { shallow: true })
            close()
        }
        update(<AdModal adTime={5} callback={callback} />)
    }


    return (
        <>
            {
                user &&
                <Modal
                    customColors={{
                        accent: "linear-gradient(-180deg, rgba(0,180,216,1) 0%, rgba(72,202,228,1) 15%, rgba(173,232,244,1) 100%)",
                        icon: "#48cae4",
                        text: "white"
                    }}
                    icon={<ProfileIcon />}
                    title='Join A Game'
                    closeBtn

                    closeClbck={() => close(-1)}
                >
                    <div className={styles["join-modal"]}>
                        <header className={styles["join-modal__header"]}>
                            <Profile
                                username={user.username}
                                avatar={user.avatar}
                                showHelper={user.guest === true}
                            />

                            <hr />
                            <SubmitButton clickCallback={click} />
                        </header>
                        <form className={styles["join-modal__form"]}>
                            {
                                error &&
                                <h2 className={styles["join-modal__error"]}>{error.message}</h2>
                            }


                            <TextInput
                                label='Join Code'
                                retriever={setJoinCode}
                            />
                        </form>
                    </div>


                </Modal>
            }
        </>
    )
}

export default JoinModal