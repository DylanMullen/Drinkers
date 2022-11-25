import WaterfallCard from 'components/waterfall/game/card/WaterfallCard';
import { CardStack } from 'components/waterfall/game/lobby/Lobby';
import Header from 'components/shared/header'
import Head from 'next/head'
import React from 'react'

import styles from 'styles/pages/waterfall/creator.module.scss';

type Props = {}

function Creator({ }: Props)
{
    return (
        <>
            <Head>
                <title>Deck Creator | Drinkers</title>
                <meta name="robots" content="all" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <meta name="title" content="Deck Creator | Drinkers" />
                <meta name="description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
                <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, still site, the still site, card game, cards, playing cards, alcohol" />
                <meta name="url" content="https://drinkers.beer/waterfall" />

                <meta name="og:title" content="Waterfall | Drinkers" />
                <meta name="og:site_name" content="Drinkers Beer" />
                <meta name="og:type" content="website" />
                <meta name="og:url" content="https://drinkers.beer/waterfall" />
                <meta name="og:description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />

            </Head>

            <header className={styles["header"]}>
                {/* <Header /> */}
            </header>
            <main id="creator" className={styles["creator"]}>
                <div className={styles["creator__card"]}>
                    <WaterfallCard 
                        cardDetails={{
                            face: 0,
                            suite: 0,
                            hidden: false,
                            isChild: false
                        }}
                        ruleDetails={{
                            title: "Yeot",
                            description: "YA YEOOOOOOT"
                        }}
                        flipSettings={{
                            clickable: true,
                            onCreation: {
                                delay: 0,
                                flip: true
                            }
                        }}
                    
                    
                    
                    />
                </div>
                <div className="creator__options">

                </div>
            </main>
        </>
    )
}

export default Creator