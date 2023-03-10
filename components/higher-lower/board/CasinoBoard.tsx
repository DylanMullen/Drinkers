import Image from 'next/image'
import React, { createRef, ReactNode, useEffect, useRef, useState } from 'react'

import styles from './casino-board.module.scss'

import Watermark from 'public/watermark.svg'
import CasinoPlayers from './players/CasinoPlayers'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'

type Props = React.PropsWithChildren & {
  // casinoStyle?: {
  //   tableTop?: string,
  //   inner?: string,
  //   outer?: string
  // }
}

type WrapperProps = React.PropsWithChildren & {
  players?: ReactNode
}


function CasinoBoard({ children }: Props)
{
  const theme = useAppSelector(HiLoSelectors.theme)
  return (
    <>
      <div className={styles["casino-board"]} style={{ backgroundColor: theme.table }} >
        <div className={styles["casino-board__content"]}>
          <div className={styles["casino-board__watermark__wrapper"]}>
            <div className={styles["casino-board__watermark"]} />
          </div>
          <div className={styles["casino-board__children"]}>
            {children}
          </div>
        </div>
        <div className={styles["casino-board__edges"]}
          style={{ boxShadow: getBoxShadow("#181817", "#131312") }}
        />
      </div>
    </>

  )
}

function CasinoBoardWrapper({ players, children }: WrapperProps)
{
  return (
    <div className={styles["casino-board__wrapper"]}>
      {players}
      <CasinoBoard>
        {children}
      </CasinoBoard>
    </div>
  )
}

function getBoxShadow(inner: string, outer: string)
{
  return (
    `
      inset 1px -1.5rem 0px .75rem ${outer},
      inset 1px -4rem 3px 1rem ${inner},
      inset -2rem -2rem 3px 1rem ${inner},
      inset 2rem -2rem 3px 1rem ${inner},
      inset 10px -100px 8rem .25rem rgba(0,0,0,0.75)
    `
  )
}



export default CasinoBoardWrapper