import { DISCORDURL } from 'components/waterfall/lobby/modals/profile/ProfileModal';
import useUser from 'context/UserContext'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { FaDiscord } from 'react-icons/fa';

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

  const user = useUser();
  const loading = user === undefined;


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
                <span className={styles["profile__username"]} style={{ color: scheme?.color }}>{user.username}</span>
                {
                  user.guest ?
                    <div className={styles["profile__signup"]}>
                      <a href={DISCORDURL} target={"_blank"} rel={"noreferrer"}>
                        <span className={`${styles["profile__btn"]} ${styles["profile__btn--login"]}`}>
                          <FaDiscord />
                          Login with Discord
                        </span>
                      </a>
                    </div> : ""
                }

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