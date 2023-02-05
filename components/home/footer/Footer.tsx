import React from 'react'

import TextLogo from 'public/weblogo-text.svg'

import styles from './footer.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FaDiscord, FaTwitter, FaYoutube } from 'react-icons/fa'

type Props = {
    text: string,
    link: string,
    modifier?: string
    icon: React.ReactNode,
}

function Footer()
{
    return (
        <footer className={styles["footer"]}>
            <svg id="visual" viewBox="0 0 960 540" width="100%" height="270" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1" className={styles["footer__divider"]}>
                <path d="M0 351L22.8 361.2C45.7 371.3 91.3 391.7 137 391.2C182.7 390.7 228.3 369.3 274 357.7C319.7 
                    346 365.3 344 411.2 347C457 350 503 358 548.8 366.5C594.7 375 640.3 384 686 392.3C731.7 
                    400.7 777.3 408.3 823 412C868.7 415.7 914.3 415.3 937.2 415.2L960 415L960 541L937.2 541C914.3 
                    541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 
                    411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="#4b4949" />
                <path d="M0 424L22.8 428.2C45.7 432.3 91.3 440.7 137 440.3C182.7 440 228.3 431 274 420.7C319.7 410.3 365.3 398.7 411.2 
                    397C457 395.3 503 403.7 548.8 410.7C594.7 417.7 640.3 423.3 686 420.8C731.7 418.3 777.3 407.7 823 400.2C868.7 392.7 
                    914.3 388.3 937.2 386.2L960 384L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 
                    594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 
                    541 22.8 541L0 541Z" fill="#3b3b3b" />
                <path d="M0 488L22.8 481.8C45.7 475.7 91.3 463.3 137 463.8C182.7 464.3 228.3 477.7 274 482.7C319.7 487.7 365.3 484.3
                     411.2 481.7C457 479 503 477 548.8 477.7C594.7 478.3 640.3 481.7 686 476C731.7 470.3 777.3 455.7 823 451.2C868.7 446.7
                      914.3 452.3 937.2 455.2L960 458L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541
                       594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541
                        45.7 541 22.8 541L0 541Z" fill="#2a2a2a" />
            </svg>

            <ul className={styles["footer__content"]}>
                <li className={styles["footer__branding"]}>
                    <div className={styles["footer__logo"]}>
                        <Image
                            src={TextLogo}

                            layout="fill"
                        />
                    </div>
                </li>
                <li className={styles["footer__social"]}>
                    <ul className={styles["footer__social__list"]}>
                        <li>
                            <FooterButton
                                text='Discord'
                                icon={<FaDiscord />}
                                modifier="discord"
                                link="https://discord.gg/RK45xnyYFg"
                            />
                        </li>
                        <li>
                            <FooterButton
                                text='Twitter'
                                icon={<FaTwitter />}
                                modifier="twitter"
                                link="https://twitter.com/StillDrinkers"
                            />
                        </li>
                        <li>
                            <FooterButton
                                text='YouTube'
                                icon={<FaYoutube />}
                                modifier="youtube"
                                link="https://www.youtube.com/channel/UCec2wk1-FF6VhhdIiKo-VqA"
                            />
                        </li>
                    </ul>
                </li>
            </ul>
        </footer>
    )
}

function FooterButton({ icon, link, text, modifier }: Props)
{
    return (
        <a href={link} target="_blank" rel='noreferrer' className={`${styles["footer-btn"]} ${modifier ? styles[`footer-btn--${modifier}`] : ""}`}>
            <div className={styles["footer-btn__icon"]}>
                {icon}
            </div>
            <span className={styles["footer-btn__text"]}>
                {text}
            </span>
        </a>
    )
}

export default Footer