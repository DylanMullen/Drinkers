import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import HiLoCards from 'components/higher-lower/cards';
import Footer from 'components/higher-lower/footer';
import useNavigation from 'context/NavigationContext';
import useUser from 'context/UserContext';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import React, { useEffect } from 'react'
import { HiLoController } from 'services/hi-lo/game/HiLoGameController';

import styles from 'styles/pages/higher-lower/game.module.scss'

type Props = {}

function HigherLowerGame({ }: Props)
{
    const {user} = useUser()
    const { hideNavigationButton, hide } = useNavigation();

    useEffect(() =>
    {
        if(user === undefined)
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
                <CasinoBoard boardName='Hi-Lo'>
                    <div className={styles["game__cards"]}>
                        <HiLoCards />
                    </div>
                </CasinoBoard>
            </main>
            <Footer />
        </>
    )
}

export default HigherLowerGame