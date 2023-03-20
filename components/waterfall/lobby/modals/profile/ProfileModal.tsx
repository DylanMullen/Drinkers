import React from 'react'
import Modal from 'components/shared/modal/Modal'
import { CgProfile as ProfileIcon } from 'react-icons/cg';
import { SiDiscord } from 'react-icons/si';

import styles from './modal-profile.module.scss'
import ProfileEditor from '../../profile-editor';
import SubmitButton from 'components/shared/input/buttons/submit';
import { getUser, logout, User } from 'utils/UserUtil';
import { uuid } from 'uuidv4';
import useUser from 'context/UserContext';

type Props = {
    close: Function

}
export const DISCORDURL = "https://discord.com/api/oauth2/authorize?client_id=852274286017249330&redirect_uri=https%3A%2F%2Fdrinkers.party%2Fapi%2Flogin&response_type=code&scope=identify%20email"

function ProfileModal({ close }: Props)
{
    const { user, updateGuest, updateGuestAvatar } = useUser();
    const isSignedIn = !user?.guest;

    const saveUser = (username: string, avatar:string) =>
    {
        updateGuest(username)
        updateGuestAvatar(avatar)
        close()
    }


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



export default ProfileModal