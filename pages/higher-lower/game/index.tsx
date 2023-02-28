import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import CasinoPlayers from 'components/higher-lower/board/players/CasinoPlayers';
import HiLoCards from 'components/higher-lower/cards';
import Footer from 'components/higher-lower/footer';
import Ribbon from 'components/shared/ribbon';
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