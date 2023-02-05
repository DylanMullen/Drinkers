import React, { useEffect, useState } from 'react'
import Head from '../../node_modules/next/head'
import styles from 'styles/pages/waterfall/home.module.scss';
import Header from 'components/shared/header';
import Menu from 'components/waterfall/lobby/menu';

import { IoBeer } from '@react-icons/all-files/io5/IoBeer';
import { useRouter } from 'next/router';
import { getUser, User } from 'utils/UserUtil';
import { createWaterfallGame, getCurrentGame } from 'services/waterfall/GameController';
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal';
import useNavigation from 'context/NavigationContext';
import BuyUsBeer from 'components/shared/buyusbeer';
import useUser from 'context/UserContext';
import { useModalContext } from 'context/ModalContext';
import AdModal from 'components/shared/modals/ad';

// import x from 

function WaterfallHome()
{
    const { user } = useUser();
    const { update, open, close } = useModalContext()

    const router = useRouter();
    const { showNavigationButton } = useNavigation()

    // showNavigationButton()

    const goTo = () =>
    {
        close();
        router.push("/waterfall/game?code=" + getCurrentGame().gameCode);
    }

    const create = async () =>
    {
        if (user === undefined) return;

        let response = await createWaterfallGame({
            owner: { uuid: user?.uuid ?? "", username: user?.username ?? "", avatar: user?.avatar ?? "" }, settings: {
                gameName: "Waterfall",
                hiddenBack: false,
                maxPlayers: 8,
                actionsEnabled: true
            }
        });
        if (response === undefined) return;

        update(<AdModal adTime={5} callback={goTo} />)
        open()
    }

    useEffect(() =>
    {
        showNavigationButton()
    }, [])

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

            <header id="waterfall-header" className={styles["waterfall-header"]}>
                <Header
                    name='Waterfall'
                    logo={"/imgs/waterfall.png"}
                />
            </header>
            <main id="waterfall-lobby" className={styles["waterfall-lobby"]}>
                <Menu gameMode={GameMode.WATERFALL} create={create} />
                <footer className={styles["waterfall-footer"]}>
                    <BuyUsBeer />
                </footer>
            </main>


        </>
    )
}


export default WaterfallHome