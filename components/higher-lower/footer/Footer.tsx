import React, { ReactNode } from 'react'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import UserCard from '../user-card'

import styles from './footer.module.scss'

type Props = {}

function Footer({ }: Props)
{
  const players = useAppSelector(HiLoSelectors.users)
  const current = useAppSelector(HiLoSelectors.currentUser)

  let userCards: ReactNode[] = players.map(e => <UserCard user={e} selected={current === e.uuid} />)

  return (
    <footer className={styles["casino-footer"]}>
      <div className={styles["casino-footer__users"]}>
        {userCards}
      </div>
    </footer>
  )
}

export default Footer