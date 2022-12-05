import Creator from 'components/admin/drunkcards/creator'
import PirateCard from 'components/pirate/game/card'
import { CreatorContextProvider } from 'context/drunkcards/creator/CreatorContext'
import Head from 'next/head'
import React from 'react'

import styles from 'styles/pages/admin/drunkcards/creator.module.scss'

type Props = {}

function PirateCreator({ }: Props)
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
          <footer className={styles["creator__footer"]}>
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            <PirateCard
              settings={{
                title: "TEst",
                description: "test"
              }}
            />
            
          </footer>
        </main>
      </CreatorContextProvider>
    </>
  )
}

export default PirateCreator