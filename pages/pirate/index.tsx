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

type Props = {}

function PirateHome({ }: Props)
{

    const [user, setUser] = useState<User>(getDefaultUser());
    const router = useRouter();

    const create = async () =>
    {
        let created = await createPirateGame(
            ["3956ceb7-fcdf-4691-bc3b-80db4085c2be", "365097f8-78db-4e8f-b6a8-30490873e706"],
            user
        )

        if (!created) return;

        router.push("/pirate/game?code=" + getPirateInstance().joinCode);
    }

    useEffect(() =>
    {
        setUser(getUser())
    }, [])



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
                    open={() => { }}
                    create={create}
                />
                {/* <footer className={styles["pirate-footer"]}>
                    <a
                        href="https://www.buymeacoffee.com/drinkers" target={"_blank"} rel="noreferrer"
                        className={styles["waterfall-footer__banner"]}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.blur()}
                    >
                        <h2 className={styles["waterfall-footer__banner__text"]}>Buy us a drink!</h2>
                        <span className={styles["waterfall-footer__banner__btn"]}><IoBeer /></span>
                    </a>
                </footer> */}
            </main>
        </>
    )
}

export default PirateHome