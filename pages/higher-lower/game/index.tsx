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
import React, { useEffect, useState } from 'react'
import { useAppSelector } from 'redux/store';
import { HiLoController } from 'services/hi-lo/game/HiLoGameController';
import { HiLoSelectors } from 'services/hi-lo/redux/slice';

import styles from 'styles/pages/higher-lower/game.module.scss'
import { User } from 'utils/UserUtil';

import TextLogo from 'public/weblogo-text.svg'
import Image from 'next/image';
import { HexColorPicker } from 'react-colorful';

type Props = { code: string }

const poolTable = ["#008eba", "#137547", "#800080"]

function HigherLowerGame({ code }: Props)
{
    const { user } = useUser()
    const { hideNavigationButton, hide } = useNavigation();

    const [color, setColor] = useState(poolTable[Math.floor(Math.random() * poolTable.length)])
    const [showEditor, setShowEditor] = useState(false);

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
                    <CasinoBoard players={getCasinoPlayers()}
                        casinoStyle={{
                            tableTop: color
                        }}
                    >
                        <div className={styles["game__logo"]}>
                            <Image
                                src={TextLogo}
                                layout="fill"
                                objectFit='contain'
                            />
                        </div>
                        <div className={styles["game__cards"]}>
                            <HiLoCards />
                        </div>
                    </CasinoBoard>
                </div>
            </main>

            <aside className={styles["theme-selector"]}>
                {
                    poolTable.map(e =>
                    {
                        return (
                            <button className={styles["theme-selector__btn"]} style={{ background: e }} onClick={() => setColor(e)} />
                        )
                    })
                }
                {
                    showEditor &&
                    <div className={styles["theme-selector__editor"]}>
                        <HexColorPicker color={color} onChange={(col)=>setColor(col)} onBlur={()=>setShowEditor(false)}/>
                    </div>
                }
                <button className={styles["theme-selector__btn"]} onClick={()=>setShowEditor(prev=>!prev)}/>
            </aside>
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