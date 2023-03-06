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
import { useRouter } from 'next/router';
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

    const router = useRouter()

    const join = async (code: string, user: User) =>
    {
        let status = await HiLoController.join(user, code)
        if (!status)
        {
            code = await HiLoController.create(user, "CARD") ?? ""
        }

        router.push(code === "" ? "/higher-lower" : "/higher-lower/game?code=" + code, undefined, {
            shallow: code !== ""
        })
    }

    useEffect(() =>
    {
        hide();
        hideNavigationButton()
        if (user === undefined)
            return;

        if (code === undefined) return;

        // join(code, user)
    }, [user, code])

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
                        {/* <Controls /> */}
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

export async function getServerSideProps(context: GetServerSidePropsContext)
{
    let { code } = context.query

    let user: User = JSON.parse(context.req.cookies["user"])

    if (!code)
        code = await HiLoController.createDummy(user)

    return {
        props: {
            code: code as string
        }
    }
}

export default HigherLowerGame