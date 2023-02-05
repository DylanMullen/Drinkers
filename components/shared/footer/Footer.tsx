import React from 'react'

import { SiTwitter, SiDiscord, SiMinutemailer } from "react-icons/si";
import { DISCORD_URL, TWITTER_URL } from '../../../settings/Config';

import styles from './footer.module.scss'

function Footer()
{
  return (
    <footer id="#footer" className={styles["footer"]}>
      <div className="footer__column">
        <h2>Social</h2>
      </div>
    </footer>
  )
}

export default Footer