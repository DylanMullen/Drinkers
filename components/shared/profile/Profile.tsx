import ProfileModal, { DISCORDURL } from 'components/waterfall/lobby/modals/profile/ProfileModal';
import { useModalContext } from 'context/ModalContext';
import useNavigation from 'context/NavigationContext';
import useUser from 'context/UserContext'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaDiscord } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';

import styles from './profile.module.scss'

type Props = {
  scheme?: CustomScheme
}

type CustomScheme = {
  color?: string,
  rounded?: boolean,

}

function Profile({ scheme }: Props)
{
  const { update, open, close } = useModalContext();
  const { user, logout } = useUser();
  const loading = user === undefined;

  const onUsernameClick = () =>
  {
    update(<ProfileModal close={close} />);
    open()
  }

  return (
    <>
      {
        loading ? "Loading" :
          <div className={styles["profile"]}>
            <div className={styles["profile__content"]}>
              <div className={styles["profile__avatar"]}>
                <Image
                  src={user.avatar} width="100%" height="100%" layout="responsive" alt={`Your Avatar`}
                  style={{ borderRadius: scheme?.rounded ? "50%" : "inherit" }} />
              </div>
              <div className={styles["profile__username__wrapper"]}>
                <span
                  className={styles["profile__username"]}
                  style={{ color: scheme?.color, borderBottom: user.guest ? `2px dotted ${scheme?.color ?? "white"}` : "", cursor: user.guest ? "pointer" : "" }}
                  onClick={onUsernameClick}
                >
                  {user.username}
                </span>
                <div className={styles["profile__signup"]}>
                  {
                    user.guest ?
                      <a href={DISCORDURL} target={"_blank"} rel={"noreferrer"}>
                        <span className={`${styles["profile__btn"]} ${styles["profile__btn--login"]}`}>
                          <FaDiscord />
                          Login with Discord
                        </span>
                      </a>
                      :
                      <button className={`${styles["profile__btn"]} ${styles["profile__btn--signout"]}`} onClick={logout}>
                        <IoMdLogOut />
                        Sign Out
                      </button>
                  }
                </div>

              </div>
            </div>
            {/* <div className={styles["profile__footer"]}>
            </div> */}
          </div>
      }
    </>
  )
}

export default Profile