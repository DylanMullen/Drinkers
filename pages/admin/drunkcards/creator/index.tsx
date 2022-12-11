import Creator from 'components/admin/drunkcards/creator'
import PromptItem from 'components/admin/drunkcards/creator/prompt-items'
import PirateCard from 'components/pirate/game/card'
import useCreatorContext, { CreatorContextProvider } from 'context/drunkcards/creator/CreatorContext'
import Head from 'next/head'
import React, { createRef, useEffect, useRef } from 'react'

import styles from 'styles/pages/admin/drunkcards/creator.module.scss'


function PirateCreator()
{
  return (
    <>
      <Head>
        <title>Creator | Drinkers</title>
      </Head>

      <CreatorContextProvider>
        <main className={styles["creator"]}>
          <div className={styles["creator__input"]}>
            <Creator />
          </div>

        </main>
        <Footer />
      </CreatorContextProvider>
    </>
  )
}

function Footer()
{
  const { prompts: promptInfo } = useCreatorContext();

  let prompts: React.ReactNode[] = Object.keys(promptInfo).map(e =>
  {
    let prompt = promptInfo[e]

    return (
      <PromptItem key={prompt.settings.uuid} prompt={prompt} />
    )
  })



  return (
    <footer id='#footer' className={styles["creator-footer"]}>
      {
        prompts.length > 0 &&
        <div className={styles["creator-footer__items"]}>
          {prompts}
        </div>
      }
    </footer>
  )
}

export default PirateCreator