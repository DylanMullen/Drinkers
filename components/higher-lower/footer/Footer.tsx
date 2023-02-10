import useUser from 'context/UserContext'
import React, { Suspense } from 'react'
import UserCard from '../user-card'

import styles from './footer.module.scss'

type Props = {}

function Footer({ }: Props)
{
  let { user } = useUser();

  return (
    <footer className={styles["casino-footer"]}>
      <div className={styles["casino-footer__users"]}>
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />

      </div>
    </footer>
  )
}

export default Footer