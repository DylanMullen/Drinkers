import Header from 'components/shared/header'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import Logo from "public/icons/waterfall-icon.svg";
import Menu from 'components/waterfall/lobby/menu';

import styles from "styles/pages/pirate/index.module.scss"
import { createPirateGame, getAllPiratePacks, getPirateInstance } from 'services/pirate/game/PirateGameController';
import { getDefaultUser, getUser, User } from 'utils/UserUtil';
import { useRouter } from 'next/router';
import { IoBeer } from 'react-icons/io5';
import useUser from 'context/UserContext';
import { useModalContext } from 'context/ModalContext';
import CookieModal from 'components/waterfall/lobby/modals/cookies';
import AdModal from 'components/shared/modals/ad';
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal';
import useNavigation from 'context/NavigationContext';
import { GiCardRandom, GiWaterfall } from 'react-icons/gi';
import BuyUsBeer from 'components/shared/buyusbeer';

type Props = {}

function PirateHome({ }: Props)
{
    const router = useRouter();
    const { showNavigationButton } = useNavigation()

    const { user } = useUser()
    const { update, open, close } = useModalContext()

    const goTo = () =>
    {
        close();
        router.push("/drunkcards/game?code=" + getPirateInstance().joinCode);
    }

    const create = async () =>
    {
        if (user === undefined) return;
        update(<AdModal adTime={5} callback={goTo} />)
        open()
        let packIDs = await getAllPiratePacks();


        await createPirateGame(
            packIDs,
            user
        )

    }

    useEffect(() =>
    {
        showNavigationButton()

    }, [])


    return (
        <>
            <Head>
                <title>Drunkcards | Drinkers</title>
                <meta name="robots" content="all" />
                <meta name="title" content="Drunkcards | Drinkers" />
                <meta name="description" content="Drunkcards is an endless game of many possibilities to get you very drunk. Read your prompt, get lucky and drink. Simple. Dare to play?" />
                <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, drunkcards, drunk pirate, drunk cards, drunk, card game, cards, playing cards, alcohol. shots" />
                <meta name="url" content="https://drinkers.party/drunkcards" />

                <meta name="og:title" content="Drunkcards | Drinkers" />
                <meta name="og:site_name" content="Drinkers" />
                <meta name="og:type" content="website" />
                <meta name="og:url" content="https://drinkers.party/drunkcards" />
                <meta name="og:description" content="Drunkcards is an endless game of many possibilities to get you very drunk. Read your prompt, get lucky and drink. Simple. Dare to play?" />
            </Head>

            <header id="pirate-header" className={styles["pirate-header"]}>
                <Header
                    name='Drunkcards'
                    logo={<GiCardRandom />}
                />
            </header>

            <main id="pirate-main" className={styles["pirate-lobby"]} >
                <Menu
                    gameMode={GameMode.DRUNKCARDS}
                    create={create}
                />
            </main>
        </>
    )
}



export default PirateHome