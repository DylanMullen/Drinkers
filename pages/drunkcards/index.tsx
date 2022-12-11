import Header from 'components/shared/header'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import Logo from "public/icons/waterfall-icon.svg";
import Menu from 'components/waterfall/lobby/menu';

import styles from "styles/pages/pirate/index.module.scss"
import { createPirateGame, getPirateInstance } from 'services/pirate/game/PirateGameController';
import { getDefaultUser, getUser, User } from 'utils/UserUtil';
import { useRouter } from 'next/router';
import { IoBeer } from 'react-icons/io5';
import useUser from 'context/UserContext';
import { useModalContext } from 'context/ModalContext';
import CookieModal from 'components/waterfall/lobby/modals/cookies';
import AdModal from 'components/shared/modals/ad';
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal';
import useNavigation from 'context/NavigationContext';

type Props = {}

function PirateHome({ }: Props)
{
    const router = useRouter();
    const {showNavigationButton} = useNavigation()
    showNavigationButton()

    const {user} = useUser()
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


        await createPirateGame(
            ["3956ceb7-fcdf-4691-bc3b-80db4085c2be", "365097f8-78db-4e8f-b6a8-30490873e706"],
            user
        )

        // if (!created) return;
    }


    return (
        <>
            <Head>
                <title>Drunkcards | Drinkers</title>
                <meta name="robots" content="all" />
                <meta name="title" content="Drunkcards | Drinkers" />
            </Head>

            <header id="pirate-header" className={styles["pirate-header"]}>
                <Header
                    name='Drunkcards'
                    logo={Logo}
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