import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import Footer from 'components/higher-lower/footer';
import PlayingCard from 'components/shared/playing-card';
import WaterfallCard from 'components/waterfall/game/card/WaterfallCard';
import useNavigation from 'context/NavigationContext';
import Head from 'next/head'
import React, { useEffect } from 'react'

import styles from 'styles/pages/higher-lower/game.module.scss'

type Props = {}

function index({ }: Props)
{
    const { hideNavigationButton, hide } = useNavigation();

    useEffect(() =>
    {
        hide();
        hideNavigationButton()
    }, [])


    return (
        <>
            <Head>
                <title>Higher Lower</title>
            </Head>
            <main className={styles["game"]}>
                <CasinoBoard boardName='Hi-Lo'>
                    <Cards />

                </CasinoBoard>
            </main>
            <Footer />
        </>
    )
}

function Cards()
{
    return (
        <div className={styles["game__cards"]}>
            <PlayingCard
            />
            <PlayingCard
            />

        </div>
    )
}

export default index