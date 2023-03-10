import CasinoBoard from 'components/higher-lower/board/CasinoBoard';
import CasinoPlayers from 'components/higher-lower/board/players/CasinoPlayers';
import HiLoCards from 'components/higher-lower/cards';
import Footer from 'components/higher-lower/footer';
import ModalHandler from 'components/higher-lower/modals/ModalHandler';
import NextTurn from 'components/higher-lower/modals/next-turn';
import WelcomeModal from 'components/higher-lower/modals/welcome';
import PirateCard from 'components/pirate/game/card';
import Ribbon from 'components/shared/ribbon';
import JoinModal from 'components/waterfall/lobby/modals/join';
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal';
import { useModalContext } from 'context/ModalContext';
import useNavigation from 'context/NavigationContext';
import useUser from 'context/UserContext';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react'
import { useAppSelector } from 'redux/store';
import { HiLoController } from 'services/hi-lo/game/HiLoGameController';
import { HiLoSelectors, hiloSlice } from 'services/hi-lo/redux/slice';

import styles from 'styles/pages/higher-lower/game.module.scss'
import { createServerSideCookie, getUser, User } from 'utils/UserUtil';

import TextLogo from 'public/weblogo-text.svg'
import Image from 'next/image';
import { HexColorPicker } from 'react-colorful';
import Lobby from 'components/higher-lower/lobby';

type Props = { code: string }


function HigherLowerGame({ code }: Props)
{
    const started = useAppSelector(HiLoSelectors.started);
    const theme = useAppSelector(HiLoSelectors.theme)

    const { user } = useUser()
    const { hideNavigationButton, hide } = useNavigation();


    const router = useRouter()

    const join = async (code: string, user: User) =>
    {
        let status = await HiLoController.join(user, code)

        if (!status)
            code = await HiLoController.create(user, "CARD") ?? ""

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

        if (!code) return;

        join(code, user)
    }, [user, code])

    return (
        <>
            <Head>
                <title>Higher Lower</title>
            </Head>
            <ModalHandler />
            <main className={styles["game"]}>
                <div className={styles["game__board"]}>
                    <CasinoBoard
                        players={<CasinoPlayerWrapper />}
                    >
                        <div className={styles["game__logo"]}>
                            <Image
                                src={TextLogo}
                                layout="fill"
                                objectFit='contain'
                            />
                        </div>
                        {
                            started ?
                                <div className={styles["game__cards"]}>
                                    <HiLoCards />
                                </div>
                                :
                                <Lobby />
                        }
                    </CasinoBoard>
                </div>
            </main>
        </>
    )
}

function CasinoPlayerWrapper()
{
    const players = useAppSelector(HiLoSelectors.users);
    const id = useAppSelector(HiLoSelectors.settings).gameID;


    return (
        <>
            {
                id !== "" &&
                <CasinoPlayers
                    users={players}
                />
            }
        </>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext)
{
    let { code } = context.query

    if(!context.req.cookies["user"])
        createServerSideCookie(context.req, context.res)

    let user: User = JSON.parse(context.req.cookies["user"])

    if (!code)
        code = await HiLoController.createDummy(user)

    return {
        redirect: !code ? {
            permanent: false,
            destination: "/higher-lower"
        } : undefined,
        props: {
            code: code ?? null
        }
    }
}

export default HigherLowerGame