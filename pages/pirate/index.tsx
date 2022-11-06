import PirateCard from 'components/pirate/card'
import PirateCardStack from 'components/pirate/cardstack'
import React from 'react'

import styles from 'styles/pages/pirate/game.module.scss'

type Props = {}

function index({ }: Props)
{
    return (
        <>
            <main className={styles["pirate-game"]}>
                <div className={styles["pirate-game__container"]}>
                    {/* <PirateCard
                        
                    /> */}
                    <PirateCardStack
                        layers={8}
                        activeCard={{
                            title: "Tipsy Bartender",
                            description: "Name a mixed drink, everyone has to guess the ingredients of that drink. The player who gets the least ingredients right has to drink."
                        }}
                    />
                </div>
            </main>
            <footer className={styles["pirate-footer"]}>

            </footer>
        </>
    )
}

export default index