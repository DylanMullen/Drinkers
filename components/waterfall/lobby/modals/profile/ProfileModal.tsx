import React, { useEffect, useState } from 'react'
import Modal from 'components/shared/modal/Modal'
import { CgProfile as ProfileIcon } from 'react-icons/cg';
import { getCookie, setCookie } from 'cookies-next';
import Profile from '../../profile';
import { Sign } from 'crypto';
import TextInput from 'components/shared/input/text';
import InputGroup from 'components/shared/input/input-group';

import { FcGoogle } from 'react-icons/fc'
import { SiDiscord } from 'react-icons/si';

import styles from './modal-profile.module.scss'
import ProfileEditor from '../../profile-editor';
import SubmitButton from 'components/shared/input/buttons/submit';
import { getUser, logout, User } from 'utils/UserUtil';
import { uuid } from 'uuidv4';

type Props = {
    close: Function

}

type SignedInProps = {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const DISCORDURL = "https://discord.com/api/oauth2/authorize?client_id=852274286017249330&redirect_uri=https%3A%2F%2Fdrinkers.party%2Fapi%2Flogin&response_type=code&scope=identify%20email"

function ProfileModal({ close }: Props)
{

    const [user, setUser] = useState<User>();
    const isSignedIn = !user?.guest;

    const saveUser = (username: string, avatar: string, uuid: string) =>
    {
        setCookie("user", {
            uuid: uuid,
            username: username,
            avatar: avatar,
            guest: true,
        })
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
                    customColors={
                        {
                            accent: "linear-gradient(-180deg, rgba(247,157,101,1) 0%, rgba(242,112,89,1) 57%, rgba(242,92,84,1) 100%)",
                            icon: "#f79d65",
                            text: "white"
                        }
                    }
                    icon={<ProfileIcon />}
                    closeClbck={close}
                    closeBtn
                >
                    <div className={styles["profile-modal"]}>

                        {
                            isSignedIn && user &&
                            <SignedIn user={user} setUser={setUser} />
                        }
                        {
                            !isSignedIn &&
                            <div className={styles["profile-modal__signin"]}>
                                <ProfileEditor 
                                    hydrate
                                    callback={saveUser}
                                />
                                <div className={styles["profile-modal__signup"]}>
                                    <div className={styles["profile-modal__signup__footer"]}>
                                        <div className={styles["profile-modal__providers"]}>
                                            <hr className={styles["profile-modal__providers__divider"]} />

                                            <a className={styles["profile-modal__provider"]} href={DISCORDURL} target={"_blank"} rel={"noreferrer"}><SiDiscord /></a>
                                            <hr className={styles["profile-modal__providers__divider"]} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        }

                    </div>

                </Modal>

            }
        </>
    )
}

function SignedIn({ user, setUser }: SignedInProps)
{

    const click = () =>
    {
        setUser(logout())
    }

    return (
        <div className={styles["profile-modal__logged"]}>
            <header className={styles["profile-modal__logged__header"]}>
                <Profile username={user.username} avatar={user.avatar} showHelper={false} />
            </header>
            <hr />
            <div className={styles["profile-modal__logged__body"]}>
                <InputGroup columns={2}>
                    <button
                        onClick={click}
                        className={styles["profile-modal__btn"] + " " + styles["profile-modal__btn--login"]}>
                        Logout
                    </button>
                </InputGroup>
            </div>
        </div>
    )
}


export default ProfileModal