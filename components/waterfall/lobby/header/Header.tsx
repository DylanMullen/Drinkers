import Image from 'next/image';
import React from 'react'
import Logo from "public/icons/waterfall-icon.svg";

import styles from './header.module.scss';

function Header()
{
    return (
        <header id="waterfall-header" className={styles["waterfall-header"]}>
            <div className={styles["waterfall-header__logo"]}>

            <div className={styles["waterfall-header__icon"]}>
                <Image src={Logo} width="100%" height="100%" alt={`Drinkers.Beer - Waterfall`} />
            </div>
            <h1 className={styles["waterfall-header__title"]}>Waterfall</h1>
            </div>

        </header>
    )
}

export default Header