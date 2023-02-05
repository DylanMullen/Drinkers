import Image from 'next/image'
import React from 'react'

import Logo from 'public/weblogo.svg';

import styles from './home-header.module.scss'

function HomeHeader()
{
    const width = 359*1.2;
    const height = width / 1.447;

    return (
        <header id='#header' className={styles["header"]}>
            <div className={styles["header__content"]}>
                <Image src={Logo} className={styles["header__logo"]} width={width} height={height}/>
            </div>
            <div className={styles["header__footer"]}>
                <div className={styles["header__footer--top"]}>
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="13%" style={{ stopColor: "rgba(244,162,97,1)", stopOpacity: 1 }} />
                                <stop offset="86%" style={{ stopColor: "rgba(231,111,81,1)", stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill='url(#grad1)'></path>
                    </svg>
                </div>
                <div className={styles["header__footer__content"]}>
                    <h1 className={styles["header__footer__title"]}>Join The Fun Today</h1>
                    <button className={styles["header__footer__btn"]}>Play Now</button>
                </div>
                <div className={styles["header__footer--bottom"]}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" width={"100%"}>
                        <defs>
                            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="13%" style={{ stopColor: "rgba(231,111,81,1)", stopOpacity: 1 }} />
                                <stop offset="86%" style={{ stopColor: "rgba(244,162,97,1)", stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill='url(#grad2)'></path>
                    </svg>
                </div>
            </div>
        </header >
    )
}

export default HomeHeader