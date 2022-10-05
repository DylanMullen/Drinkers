import React, { useState } from 'react'
import Head from '../../node_modules/next/head'

import styles from 'styles/pages/waterfall/home.module.scss';
import Header from 'components/waterfall/lobby/header';
import Menu from 'components/waterfall/lobby/menu';

import { IoBeer } from '@react-icons/all-files/io5/IoBeer';
import LobbyModalWrapper from 'components/waterfall/lobby/modals';

function WaterfallHome()
{

    const [modal, setModalId] = useState(3);

    return (
        <>
            <Head>
                <title>Waterfall | Drinkers</title>
                <meta name="robots" content="all" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <meta name="title" content="Waterfall | Drinkers" />
                <meta name="description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
                <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, still site, the still site, card game, cards, playing cards, alcohol" />
                <meta name="url" content="https://drinkers.beer/waterfall" />

                <meta name="og:title" content="Waterfall | Drinkers" />
                <meta name="og:site_name" content="Drinkers Beer" />
                <meta name="og:type" content="website" />
                <meta name="og:url" content="https://drinkers.beer/waterfall" />
                <meta name="og:description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
            </Head>

            <Header />

            <LobbyModalWrapper id={modal} close={setModalId} />

            <main id="waterfall-lobby" className={styles["waterfall-lobby"]}>
                <Menu open={setModalId} />
                <footer className={styles["waterfall-footer"]}>
                    <a
                        href="https://www.buymeacoffee.com/drinkers" target={"_blank"} rel="noreferrer"
                        className={styles["waterfall-footer__banner"]}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.blur()}>
                        <h2 className={styles["waterfall-footer__banner__text"]}>Buy us a drink!</h2>
                        <span className={styles["waterfall-footer__banner__btn"]}><IoBeer /></span>
                    </a>
                </footer>
            </main>


        </>
    )
}


export default WaterfallHome