import Image from 'next/image';
import React from 'react'

import styles from './header.module.scss';

type Props = {
    name: string,
    logo: any
}

function Header({ name, logo }: Props)
{
    return (
        <div className={styles["header"]}>
            <div className={styles["header__logo"]}>
                <div className={styles["header__icon"]}>
                    <Image src={logo} width="100%" height="100%" priority alt={`Drinkers.Beer - Waterfall`} />
                </div>
                <h1 className={styles["header__title"]}>{name}</h1>
            </div>

        </div>
    )
}

export default Header