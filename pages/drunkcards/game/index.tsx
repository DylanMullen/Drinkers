import PirateCard from 'components/pirate/game/card'
import PirateCardStack from 'components/pirate/game/cardstack'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { getUser, User as TUser, User } from 'utils/UserUtil';


import styles from 'styles/pages/pirate/game.module.scss'
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { findPirateGame, getPirateInstance, joinPirateGame } from 'services/pirate/game/PirateGameController';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getFirstPrompt, reset, selectAllPlayers, selectNextPlayer, selectPlayers, selectPrompts } from 'redux/pirate/slice';
import UserList from 'components/shared/userlist';
import UserCard from 'components/shared/usercard';
import Head from 'next/head';
import useUser from 'context/UserContext';
import { join } from 'path';
import { useModalContext } from 'context/ModalContext';
import AdModal from 'components/shared/modals/ad';
import { getCookie, getCookies } from 'cookies-next';
import { FaChevronLeft, FaLink } from 'react-icons/fa';
import { URL } from 'settings/Config';
import useNavigation from 'context/NavigationContext';

type Props = {
    code: string
}

function PirateGame({ code }: Props)
{
    const {user} = useUser()
    const [isLoaded, setLoaded] = useState<boolean>(false);
    const { update, open, close } = useModalContext()

    const dispatch = useAppDispatch()
    const players = useAppSelector(selectAllPlayers);
    const next = useAppSelector(selectNextPlayer);

    const router = useRouter();

    const { hideNavigationButton } = useNavigation();
    hideNavigationButton()


    const back = () =>
    {
        getPirateInstance().delete()

        dispatch(reset())
        router.push("/drunkcards")
    }

    const copyLink = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()
        let url = URL + "/drunkcards/game?code=" + getPirateInstance().gameID;

        navigator.clipboard.writeText(url)
    }

    useEffect(() =>
    {
        if (!user)
        {
            return;
        }
        console.log("here")
        let joinCode = router.query["code"] as string

        const connect = async (joinCode: string, user: TUser) =>
        {
            if (getPirateInstance() !== undefined)
            {
                setLoaded(true)
                return;
            };

            let playerInGame = await find(joinCode, user.uuid);

            if (playerInGame === undefined)
            {
                router.push("/drunkcards")
                return;
            }

            if (!playerInGame)
            {
                // update(<AdModal adTime={5} callback={() => close()} />)
                // open()
            }


            let joined = await joinPirateGame(joinCode, {
                uuid: user.uuid,
                username: user.username,
                avatar: user.avatar,
                bot: false
            })
            if (!joined)
            {
                router.push("/drunkcards")
                return;
            }
            setLoaded(true)
        }

        const find = async (joinCode: string, uuid: string) =>
        {
            let res = await findPirateGame(joinCode, uuid);
            if (!res)
            {
                router.push("/drunkcards")
                return;
            };

            return res.playerFound as boolean;
        }
        connect(joinCode, user)
    }, [user])

    let users: React.ReactNode[] = []

    for (let index = 0; index < Object.keys(players).length; index++)
    {
        users.push(
            <UserCard
                user={players[index]}
                settings={{
                    shouldPulse: next === players[index].uuid
                }}
            />
        );
    }

    return (
        <>
            <Head>
                <title>Drunkcards | Drinkers</title>
                <meta name="robots" content="all" />
                <meta name="title" content="Drunkcards | Drinkers" />
            </Head>
            <div className={styles["pirate-toolbar"] + " " + styles["pirate-toolbar--left"]}>
                <button className={styles["pirate-toolbar__btn"]} onClick={back}>
                    <FaChevronLeft />
                </button>
            </div>
            <div className={styles["pirate-toolbar"] + " " + styles["pirate-toolbar--right"]}>
                <button className={styles["pirate-toolbar__btn"]} onClick={copyLink}>
                    <FaLink />
                </button>
            </div>
            <div className={styles["pirate-game__wrapper"]}>

                <main className={styles["pirate-game"]}>
                    {
                        isLoaded &&
                        <AnimatePresence>
                            <PirateCardStack />
                        </AnimatePresence>
                    }
                </main>
                <footer className={styles["pirate-footer"]}>
                    <UserList
                        users={users}
                    />
                </footer>
            </div>
        </>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext)
{
    const { code } = context.query
    return {
        props: {
            code: code as string
        }
    }
}

export default PirateGame