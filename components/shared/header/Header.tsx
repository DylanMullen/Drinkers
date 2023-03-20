import Image from 'next/image';
import React from 'react'

import styles from './header.module.scss';

type Props = {
    name: string,
    logo: string | React.ReactNode,
    removeIconStyle?: boolean
}

function Header({ name, logo, removeIconStyle }: Props)
{
    let HeaderImage: React.ReactNode;

    if (typeof logo === "string")
        HeaderImage = <Image src={logo} width="100%" height="100%" loading='eager' alt={`Drinkers.Beer - Waterfall`} unoptimized />
    else
        HeaderImage = logo

    return (
        <div className={styles["header"]} >
            <div className={styles["header__logo"]} style={{ gap: removeIconStyle ? ".5rem" : "" }}>
                <div className={styles["header__icon"]} style={removeIconStyle ? { background: "transparent", boxShadow: "none", borderRadius: "0px" } : {}}>
                    {HeaderImage}
                </div>
                <h1 className={styles["header__title"]}>{name}</h1>
            </div>

        </div>
    )
}

export default Header