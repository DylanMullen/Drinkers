import TextInput from 'components/shared/input/text'
import useNavigation from 'context/NavigationContext'
import Head from 'next/head'
import React, { ReactNode, useEffect } from 'react'
import { FaDiscord, FaGoogle, FaTwitch, FaTwitter } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import styles from 'styles/pages/login/login.module.scss'

type Props = {}

type ProviderProps = {
  name: string,
  logo: ReactNode,
  url: string
}

const providers: ProviderProps[] = [
  {
    name: "Discord",
    logo: <FaDiscord />,
    url: ""
  },
  {
    name: "Google",
    logo: <FcGoogle />,
    url: ""
  },
  {
    name: "Twitter",
    logo: <FaTwitter />,
    url: ""
  },
  {
    name: "Twitch",
    logo: <FaTwitch />,
    url: ""
  }
]

function login({ }: Props)
{

  const { hideNavigationButton, hide } = useNavigation()

  useEffect(() =>
  {
    hide()
    hideNavigationButton()
  }, [])

  return (
    <>
      <Head>
        <title>Login | Drinkers</title>
        <meta name="robots" content="all" />
        <meta name="title" content="Login | Drinkers" />
        <meta name="description" content="Drinkers is the home of Drinking Games. Need some spice to add to the night, play our range of drinking games!" />
        <meta name="keywords" content="waterfall, kings cup, drinking, drinking games, drunkcards, drunk pirate, card game, cards, playing cards, alcohol, shots" />
        <meta name="url" content="https://drinkers.party/login" />

        <meta name="og:title" content="Login | Drinkers" />
        <meta name="og:site_name" content="Drinkers" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://drinkers.party/login" />
        <meta name="og:description" content="Drinkers is the home of Drinking Games. Need some spice to add to the night, play our range of drinking games!" />

      </Head>
      <div className={styles["login"]}>
        <main className={styles["login__main"]}>
          <header className={styles["login__header"]}>
            <h1 className={styles["login__title"]}>Welcome to <span className={styles["login__title--secondary"]}>Drinkers</span></h1>
          </header>
          <form className={styles["login__form"]}>
            <div className={styles["login__input-group"]}>
              <label htmlFor="email">Email</label>
              <input className={styles["login__input"]} type="email" id="email" />
            </div>

            <div className={styles["login__input-group"]}>
              <label htmlFor="password">Password</label>
              <input className={styles["login__input"]} type="password" id="password" />
            </div>

            <div className={styles["login__btns"]}>
              <button type='button' className={`${styles["login__btn"]} ${styles["login__btn--login"]}`}>Login</button>
              <button type="button" className={`${styles["login__btn"]} ${styles["login__btn--signup"]}`}>Sign Up</button>
            </div>

          </form>

          <section className={styles["login__providers__wrapper"]}>
            <h2 className={styles["login__subtitle"]}>Or</h2>
            <ul className={styles["login__providers"]}>
              {
                providers.map(e =>
                {
                  return <LoginProvider {...e} />
                })
              }
            </ul>
          </section>
        </main>
        <aside className={styles["login__pictures"]}>

        </aside>
      </div>
    </>
  )
}

function LoginProvider({ name, url, logo }: ProviderProps)
{
  return (
    <li className={`${styles["login__provider"]} ${styles["login__provider--" + name.toLocaleLowerCase()]}`}>
      <label htmlFor={`${name}`} className="login__provider__name">Login with {name}</label>
      <a href={url} id={name} target={"_blank"}>
        {logo}
      </a>
    </li>
  )
}

export default login