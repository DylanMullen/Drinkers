import GameSelector from 'components/home/game-selector'
import HomeHeader from 'components/home/header'
import AboutUs from 'components/home/about-us'
import Section from 'components/home/section'
import Image from 'next/image'
import React from 'react'

import styles from 'styles/pages/home.module.scss'
import Footer from 'components/home/footer'
import Head from 'next/head'

type Props = {}

function home({ }: Props)
{
    return (
        <>
            <Head>
                <title>Drinkers</title>
                <meta name="robots" content="all" />
                <meta name="title" content="Drinkers" />
                <meta name="description" content="Drinkers is the home of Drinking Games. Need some spice to add to the night, play our range of drinking games!" />
                <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, drunkcards, drunk pirate, card game, cards, playing cards, alcohol, shots" />
                <meta name="url" content="https://drinkers.party/" />

                <meta name="og:title" content="Drinkers" />
                <meta name="og:site_name" content="Drinkers" />
                <meta name="og:type" content="website" />
                <meta name="og:url" content="https://drinkers.party/" />
                <meta name="og:description" content="Drinkers is the home of Drinking Games. Need some spice to add to the night, play our range of drinking games!" />
            </Head>
            <HomeHeader />
            <main className="content">
                <Section id='' title='Featured Games'
                    scheme={{
                        background: "rgba(62,62,62,1);",
                        transformY: "150px",
                    }}
                >
                    <GameSelector />
                </Section>
                <AboutUs />
            </main>
            <Footer />
        </>
    )
}

export default home