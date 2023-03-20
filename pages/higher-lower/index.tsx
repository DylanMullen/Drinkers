import Header from 'components/shared/header'
import AdModal from 'components/shared/modals/ad'
import Menu from 'components/waterfall/lobby/menu'
import { GameMode } from 'components/waterfall/lobby/modals/join/JoinModal'
import { useModalContext } from 'context/ModalContext'
import useNavigation from 'context/NavigationContext'
import useUser from 'context/UserContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { BiStats } from 'react-icons/bi'
import { getHigherLowerInstance, HiLoController } from 'services/hi-lo/game/HiLoGameController'

import styles from 'styles/pages/higher-lower/index.module.scss'

type Props = {}

function HiLo({ }: Props)
{
  const router = useRouter();
  const { showNavigationButton } = useNavigation()

  const { user } = useUser()
  const { update, open, close } = useModalContext()

  const goTo = () =>
  {
    close();

    if (!getHigherLowerInstance()) return;

    router.push("/higher-lower/game?code=" + getHigherLowerInstance().joinCode());
  }

  const create = async () =>
  {
    if (!user) return;
    HiLoController.create(user, "CARD")
    update(<AdModal adTime={5} callback={goTo} />)
    open()
  }

  useEffect(() =>
  {
    showNavigationButton()
  }, [])

  return (
    <>
      <Head>
        <title>Drunkcards | Drinkers</title>
        <meta name="robots" content="all" />
        <meta name="title" content="Higher Lower | Drinkers" />
        <meta name="description" content="The classic Higher or Lower card game - drinkified. Choose between Higher or Lower. If you win, get a prompt and drink up with your mates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, drunkcards, drunk pirate, drunk cards, drunk, card game, cards, playing cards, alcohol, shots, higher lower, hilo, higher-lower" />
        <meta name="url" content="https://drinkers.party/higher-lower" />

        <meta name="og:title" content="Higher Lower | Drinkers" />
        <meta name="og:site_name" content="Drinkers" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://drinkers.party/higher-lower" />
        <meta name="og:description" content="The classic Higher or Lower card game - drinkified. Choose between Higher or Lower. If you win, get a prompt and drink up with your mates." />
      </Head>

      <header id="hilo-header" className={styles["hilo-header"]}>
        <Header
          name='Higher Lower'
          logo={<BiStats />}
        />
      </header>

      <main id="hilo-main" className={styles["hilo-lobby"]} >
        <Menu
          gameMode={GameMode.HIGHER_LOWER}
          create={create}
        />
      </main>
    </>
  )
}

export default HiLo