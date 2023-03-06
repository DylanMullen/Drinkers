import Image from 'next/image'
import React, { ReactNode } from 'react'

import styles from './casino-board.module.scss'

import Watermark from 'public/watermark.svg'
import CasinoPlayers from './players/CasinoPlayers'

type Props = React.PropsWithChildren & {
  players?: ReactNode
  casinoStyle?: {
    tableTop?: string,
    inner?: string,
    outer?: string
  }
}


function CasinoBoard({ players, casinoStyle = {}, children }: Props)
{
  return (
    <div className={styles["casino-board__wrapper"]}>
      {players}

      <div className={styles["casino-board"]} style={{ backgroundColor: casinoStyle?.tableTop }}>
        <div className={styles["casino-board__content"]}>
          <div className={styles["casino-board__watermark__wrapper"]}>
            <div className={styles["casino-board__watermark"]} />
          </div>
          <div className={styles["casino-board__children"]}>
            {children}
          </div>
        </div>
        <div className={styles["casino-board__edges"]}
          style={{ boxShadow: getBoxShadow(casinoStyle.inner ?? "#181817", casinoStyle.outer ?? "#131312") }}
        />
      </div>
    </div>
  )
}

function getBoxShadow(inner: string, outer: string)
{
  return (
    `
      inset 1px -1.5rem 0px .75rem ${outer},
      inset 1px -4rem 3px 2rem ${inner},
      inset -2rem -2rem 3px 2rem ${inner},
      inset 2rem -2rem 3px 2rem ${inner},
      inset 10px -100px 8rem .25rem rgba(0,0,0,0.75)
    `
  )
}



export default CasinoBoard