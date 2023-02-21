import Image from 'next/image'
import React, { ReactNode } from 'react'

import styles from './casino-board.module.scss'

import Watermark from 'public/watermark.svg'
import CasinoPlayers from './players/CasinoPlayers'

type Props = React.PropsWithChildren & {
  boardName: string
  players?: ReactNode
  style?: React.CSSProperties
}

function CasinoBoard({ boardName, players, style, children }: Props)
{
  return (
    <div className={styles["casino-board__wrapper"]}>
      <div className={styles["casino-board"]} style={style}>
        {/* {
          players &&
        } */}
        <div className={styles["casino-board__content"]}>
          <CasinoPlayers />
          <div className={styles["casino-board__watermark__wrapper"]}>

            <div className={styles["casino-board__watermark"]} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}



export default CasinoBoard