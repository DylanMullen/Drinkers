import SubmitButton from 'components/shared/input/buttons/submit';
import TextInput from 'components/shared/input/text';
import Modal from 'components/shared/modal'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { CgProfile as ProfileIcon } from 'react-icons/cg';
import { getCurrentGame, joinWaterfallGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';
import Profile from '../../profile';

import styles from './join-modal.module.scss'

type Props = {
    close: Function

}

export type Error = {
    message: string
}

function JoinModal({ close }: Props)
{

    const router = useRouter();

    const [user, setUser] = useState<User>()
    const [error, setError] = useState<Error>();

    const [joinCode, setJoinCode] = useState("");

    const click = async () =>
    {
        if (!user)
            return;

        let error = await joinWaterfallGame({ joinCode: joinCode, player: user })

        if (!error) return;

        if (error as Error)
        {
            setError(error as Error);
            return;
        }


        router.push("/waterfall/" + getCurrentGame().gameCode, "", { shallow: true })

    }

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    return (
        <>
            {
                user &&
                <Modal
                    customColors={{
                        accent: "#90e0ef",
                        icon: "#79d8e9",
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
                                open={() => close(2)}

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