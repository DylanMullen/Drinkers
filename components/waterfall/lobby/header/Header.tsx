import Image from 'next/image';
import React from 'react'
import Logo from "public/icons/waterfall-icon.svg";

import styles from './header.module.scss';

function Header()
{
    return (
        <div className={styles["header"]}>
            <div className={styles["header__logo"]}>
                <div className={styles["header__icon"]}>
                    <Image src={Logo} width="100%" height="100%" priority alt={`Drinkers.Beer - Waterfall`} />
                </div>
                <h1 className={styles["header__title"]}>Waterfall</h1>
            </div>

        </div>
    )
}

export default Header