import useUser from 'context/UserContext'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

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
              <span className={styles["profile__username"]} style={{ color: scheme?.color }}>{user.username}</span>
            </div>
            <div className={styles["profile__footer"]}>
              {
                user.guest ?
                <div className={styles["profile__signup"]}>
                  <Link href={"/"}>
                    <span className={`${styles["profile__btn"]} ${styles["profile__btn--register"]}`}>Register</span>
                  </Link>
                  <Link href={"/"}>
                    <span className={`${styles["profile__btn"]} ${styles["profile__btn--login"]}`}>Login</span>
                  </Link>
                </div>: ""
              }
            </div>
          </div>
      }
    </>
  )
}

export default Profile