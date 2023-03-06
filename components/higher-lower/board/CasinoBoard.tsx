import Image from 'next/image'
import React, { ReactNode } from 'react'

import styles from './casino-board.module.scss'

import Watermark from 'public/watermark.svg'
import CasinoPlayers from './players/CasinoPlayers'

type Props = React.PropsWithChildren & {
  players?: ReactNode
  style?: React.CSSProperties
}

function CasinoBoard({ players, style, children }: Props)
{
  return (
    <div className={styles["casino-board__wrapper"]}>
      {players}

      <div className={styles["casino-board"]} style={style}>
        <div className={styles["casino-board__content"]}>
          <div className={styles["casino-board__watermark__wrapper"]}>
            <div className={styles["casino-board__watermark"]} />
          </div>
          <div className={styles["casino-board__children"]}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}



export default CasinoBoard