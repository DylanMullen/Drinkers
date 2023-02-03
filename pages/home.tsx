import GameSelector from 'components/home/game-selector'
import HomeHeader from 'components/home/header'
import AboutUs from 'components/home/about-us'
import Section from 'components/home/section'
import Footer from 'components/shared/footer'
import Image from 'next/image'
import React from 'react'

import styles from 'styles/pages/home.module.scss'

type Props = {}

function home({ }: Props)
{
    return (
        <>
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
            {/* <Footer /> */}
        </>
    )
}

export default home