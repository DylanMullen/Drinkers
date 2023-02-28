import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import CasinoPlayers from 'components/higher-lower/board/players/CasinoPlayers';
import HiLoCards from 'components/higher-lower/cards';
import Footer from 'components/higher-lower/footer';
import ModalHandler from 'components/higher-lower/modals/ModalHandler';
import NextTurn from 'components/higher-lower/modals/next-turn';
import WelcomeModal from 'components/higher-lower/modals/welcome';
import Ribbon from 'components/shared/ribbon';
import JoinModal from 'components/waterfall/lobby/modals/join';
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal';
import { useModalContext } from 'context/ModalContext';
import useNavigation from 'context/NavigationContext';
import useUser from 'context/UserContext';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useAppSelector } from 'redux/store';
import { HiLoController } from 'services/hi-lo/game/HiLoGameController';
import { HiLoSelectors } from 'services/hi-lo/redux/slice';

import styles from 'styles/pages/higher-lower/game.module.scss'
import { User } from 'utils/UserUtil';

type Props = { code: string }

function HigherLowerGame({ code }: Props)
{
    const { user } = useUser()
    const { hideNavigationButton, hide } = useNavigation();

    const { update, open, close } = useModalContext();

    useEffect(() =>
    {
        if (user === undefined)
            return;

        HiLoController.create(user, "CARD")

        hide();
        hideNavigationButton()
    }, [user])

    return (
        <>
            <Head>
                <title>Higher Lower</title>
            </Head>
            <ModalHandler />
            <main className={styles["game"]}>
                <div className={styles["game__board"]}>

                    <CasinoBoard players={getCasinoPlayers()}>
                        <div className={styles["game__cards"]}>
                            <HiLoCards />
                        </div>
                    </CasinoBoard>
                </div>
            </main>
        </>
    )
}

function getCasinoPlayers()
{
    const players = useAppSelector(HiLoSelectors.users);


    return (
        <CasinoPlayers
            users={players}
        />
    )
}


export default HigherLowerGame