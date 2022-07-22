import React from 'react'

import { SiTwitter, SiDiscord, SiMinutemailer } from "react-icons/si";
import { DISCORD_URL, TWITTER_URL } from '../../../settings/Config';

import styles from './Footer.module.scss'

function Footer()
{
  return (
    <footer className={styles.footer}>
      <section className={styles["footer-social"]}>
        <ul>
          <li className={styles["footer-social__item"]+ " " + styles["footer-social--discord"]}>
            <a href={DISCORD_URL}>
              <SiDiscord />Discord
            </a>
          </li>
          <li className={styles["footer-social__item"] + " " + styles["footer-social--twitter"]}>
            <a href={TWITTER_URL}>
              <SiTwitter />Twitter
            </a>
          </li>
          <li className={styles["footer-social__item"] + " " + styles["footer-social--email"]}>
            <a href="">
              <SiMinutemailer />Email Us
            </a>
          </li>
        </ul>
      </section>
      <section>
      </section>
      <section>
      </section>
    </footer>
  )
}

export default Footer