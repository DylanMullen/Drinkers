import CookieModal from 'components/waterfall/lobby/modals/cookies';
import { useModalContext } from 'context/ModalContext';
import useUser from 'context/UserContext'
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { FaCookieBite, FaDiscord, FaHome, FaTwitter } from 'react-icons/fa';
import { GiCardRandom, GiHamburgerMenu, GiWaterfall } from 'react-icons/gi';

import Profile from '../profile';

import styles from './navbar.module.scss'
import Navlink from './navlink';
import useNavigation from 'context/NavigationContext';
import { BiStats } from 'react-icons/bi';

type Props = {}

function Navbar({ }: Props)
{
    const { open: openModal, close, update } = useModalContext();
    const { btnVisible, visible, show, hide } = useNavigation();

    const { user } = useUser();
    const loading = user === undefined;

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.currentTarget.blur()


        if (visible) hide()
        else show();
    }

    const openCookies = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        toggleMenu(e)
        update(<CookieModal close={close} />)
        openModal()
    }

    return (
        <>
            <nav className={`${styles["navbar"]} ${styles[`navbar--${visible ? "open" : "closed"}`]}`}>
                {
                    btnVisible &&
                    <button className={styles["navbar__toggle"]} onClick={toggleMenu}>
                        {
                            !visible ? <GiHamburgerMenu /> : <AiOutlineClose />
                        }
                    </button>
                }

                <div className={styles["navbar__header"]}>
                    <div className={styles["navbar__profile"]}>
                        {
                            loading ? <h2>Loading...</h2> : <Profile scheme={{ rounded: true, color: "white" }} />
                        }
                    </div>
                </div>
                <div className={styles["navbar__body"]}>
                    <ul className={styles["navbar__links"]}>
                        <Navlink
                            text='Home'
                            icon={<FaHome />}
                            link="/"
                        />
                        <Navlink
                            text='Waterfall'
                            icon={<GiWaterfall />}
                            link="/waterfall"
                        />
                        <Navlink
                            text='Drunkcards'
                            icon={<GiCardRandom />}
                            link="/drunkcards"
                        />
                        <Navlink
                            text='Higher Lower'
                            icon={<BiStats />}
                            link="/higher-lower"
                        />
                    </ul>
                    <div className={styles["navbar__footer"]}>
                        <a href={"https://twitter.com/StillDrinkers"} rel="noopener noreferrer" target="_blank"
                            className={`${styles["navbar__social"]} ${styles["navbar__social--twitter"]}`}>
                            <FaTwitter />

                        </a>
                        <a href={"https://discord.gg/RK45xnyYFg"} rel="noopener noreferrer" target="_blank"
                            className={`${styles["navbar__social"]} ${styles["navbar__social--discord"]}`}>
                            <FaDiscord />
                        </a>

                        <button className={`${styles["navbar__social"]} ${styles["navbar__social--cookies"]}`} onClick={openCookies}><FaCookieBite /></button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar