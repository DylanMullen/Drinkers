import useNavigation from 'context/NavigationContext'
import Link from 'next/link'
import React from 'react'

import styles from '../navbar.module.scss'

type Props = {
    text: string
    link: string
    icon: React.ReactNode
}

function Navlink({ text, link, icon }: Props)
{
    const { hide } = useNavigation()

    return (

        <Link href={link}>
            <li className={styles["navlink"]} onClick={hide}>
                {icon}
                <span className={styles["navlink__text"]}>{text}</span>
            </li>
        </Link>
    )
}

export default Navlink