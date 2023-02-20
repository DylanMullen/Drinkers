import Image from 'next/image'
import React from 'react'

import styles from './casino-board.module.scss'

type Props = React.PropsWithChildren & {
  boardName: string
  style?:React.CSSProperties
}

function CasinoBoard({ boardName, style, children }: Props)
{
  return (
    <div className={styles["casino-board__wrapper"]}>
      <div className={styles["casino-board"]} style={style}>
        {children}
      </div>
    </div>
  )
}

export default CasinoBoard