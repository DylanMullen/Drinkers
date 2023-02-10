import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import Footer from 'components/higher-lower/footer';
import ProgressBar from 'components/shared/input/progress';
import PlayingCard from 'components/shared/playing-card';
import { CardStyle } from 'components/shared/playing-card/PlayingCard';
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
    let width = 12;
    let height = 12 * 1.4

    const cardStyles: CardStyle[] = [
        {
            card: {
                cardBackground: "#2c2c2c",
                width: `${width}rem`,
                height: `${height}rem`
            },
            pips: {
                color: "#e01e37",
                size: "2rem"
            }
        },
        {
            card: {
                cardBackground: "#1b1b1b",
                width: `${width}rem`,
                height: `${height}rem`
            },
            pips: {
                color: "#dee2e6",
                size: "2rem"
            }
        }
    ]

    return (
        <div className={styles["game__cards"]}>
            <PlayingCard
                settings={{
                    suite: 0,
                    face: 9
                }}
                flipSettings={{
                    clickable: false
                }}
                cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
            />
            <PlayingCard
                settings={{
                    suite: 3,
                    face: 9
                }}
                flipSettings={{
                    clickable: false,
                    defaultFlipped: true
                }}
                cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
            />

        </div>
    )
}

export default index