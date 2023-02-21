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

        console.log(code)

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

                    <CasinoBoard boardName='Hi-Lo'>
                        <div className={styles["game__cards"]}>
                            <HiLoCards />
                        </div>
                    </CasinoBoard>
                </div>
            </main>
            {/* <Footer /> */}
        </>
    )
}

// export async function getServerSideProps(context: GetServerSidePropsContext)
// {
//     let { create, code} = context.query

//     const cookie = context.req.cookies.user;

//     const user:User = JSON.parse(cookie);

//     if(create === "true" && user)
//     {
//         HiLoController.create(user, "CARD")
//         code = getHigherLowerInstance().gameID
//     }



//     return {
//         props: {
//             // code: code
//         }
//     }
// }

export default HigherLowerGame