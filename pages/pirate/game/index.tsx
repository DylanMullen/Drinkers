import PirateCard from 'components/pirate/game/card'
import PirateCardStack from 'components/pirate/game/cardstack'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { getUser, User as TUser, User } from 'utils/UserUtil';


import styles from 'styles/pages/pirate/game.module.scss'
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getPirateInstance, joinPirateGame } from 'services/pirate/game/PirateGameController';
import { useAppSelector } from 'redux/store';
import { getFirstPrompt, selectAllPlayers, selectNextPlayer, selectPlayers, selectPrompts } from 'redux/pirate/slice';
import UserList from 'components/shared/userlist';
import UserCard from 'components/shared/usercard';

type Props = {
    code: string
}
function index({ code }: Props)
{
    const [user, setUser] = useState<TUser>();
    const [isLoaded, setLoaded] = useState<boolean>(false);

    const prompts = useAppSelector(selectPrompts);
    const players = useAppSelector(selectAllPlayers);
    const next = useAppSelector(selectNextPlayer);

    const router = useRouter();

    useEffect(() =>
    {
        let user = getUser();
        let joinCode = router.query["code"] as string

        const connect = async (joinCode: string, user: TUser) =>
        {
            if (getPirateInstance() !== undefined)
            {
                setLoaded(true)
                return;
            };
            let joined = await joinPirateGame(joinCode, {
                uuid: user.uuid,
                username: user.username,
                avatar: user.avatar,
                bot: false
            })
            if (!joined)
            {
                router.push("/pirate")
                return;
            }
            setLoaded(true)
        }

        connect(joinCode, user)
        setUser(user)
    }, [])

    useEffect(() =>
    {
        if (next === "")
            router.push("/pirate")
    }, [next])

    let users: React.ReactNode[] = []
    let promptID = getFirstPrompt()

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
            <main className={styles["pirate-game"]}>
                {
                    isLoaded && prompts[promptID] !== undefined &&
                    <PirateCard
                        settings={{
                            title: prompts[promptID].title,
                            description: prompts[promptID].description,
                            debug: true
                        }}
                    />}
            </main>
            <footer className={styles["pirate-footer"]}>
                <UserList
                    users={users}
                />
            </footer>
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

export default index