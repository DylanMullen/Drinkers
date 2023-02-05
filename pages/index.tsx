import React from 'react'

import Head from 'next/head'
import dynamic from 'next/dynamic'

const GameSelector = dynamic(() => import('components/home/game-selector'))
const AboutUs = dynamic(() => import("components/home/about-us"))
const Footer = dynamic(() => import("components/home/footer"))
const HomeHeader = dynamic(() => import('components/home/header'))


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
                <GameSelector />
                <AboutUs />
            </main>
            <Footer />
        </>
    )
}

export default home