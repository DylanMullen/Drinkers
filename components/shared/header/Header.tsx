import Image from 'next/image';
import React from 'react'

import styles from './header.module.scss';

type Props = {
    name: string,
    logo: any,
    removeIconStyle?: boolean
}

function Header({ name, logo, removeIconStyle }: Props)
{
    return (
        <div className={styles["header"]} >
            <div className={styles["header__logo"]} style={{gap: removeIconStyle ? ".5rem" : ""}}>
                <div className={styles["header__icon"]} style={removeIconStyle ? { background: "transparent", boxShadow: "none", borderRadius: "0px" } : {}}>
                    <Image src={logo} width="100%" height="100%" loading='eager' alt={`Drinkers.Beer - Waterfall`} unoptimized />
                </div>
                <h1 className={styles["header__title"]}>{name}</h1>
            </div>

        </div>
    )
}

export default Header