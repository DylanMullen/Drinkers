import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react';

import { IoBeer } from 'react-icons/io5'
import { GiWaterfall } from 'react-icons/gi'

import MenuOption from 'components/waterfall/lobby/options/MenuOption';
import Header from 'components/shared/header';

export default function Home()
{

  let router = useRouter();

  const click = (page: string) => router.push(page)

  return (
    <>
      <Head>
        <title>Home | Drinkers</title>
        <meta name="robots" content="all" />
        <meta name="title" content="Home | Drinkers" />
        <meta name="description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
        <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, still site, the still site, card game, cards, playing cards, alcohol" />
        <meta name="url" content="https://drinkers.party/" />

        <meta name="og:title" content="Home | Drinkers" />
        <meta name="og:site_name" content="Drinkers" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://drinkers.party/" />
        <meta name="og:description" content="Waterfall is a drinking card game that you can play to spice up your drinking sessions with the fun and exciting prompts in the deck" />
      </Head>
      <main
        style={{
          display: "grid",
          placeContent: "center",
          height: "100%"
        }}

      >
        <Header logo={"/imgs/waterfall.png"} name='Drinkers' />
        <div style={{
          display: "flex",
          marginTop: "2rem",
          marginBottom: "10rem",
          justifyContent: "center"
        }}>
          <MenuOption
            text='Waterfall'
            icon={<GiWaterfall />}
            modifier="join" callback={() => click("/waterfall")} />
          <MenuOption
            text='Drunkcards'
            icon={<IoBeer />}
            modifier="profile" callback={() => click("/drunkcards")} />
        </div>
      </main>
    </>
  )
}
