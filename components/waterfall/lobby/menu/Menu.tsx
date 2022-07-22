import React from 'react'

import { BiDrink as JoinIcon } from 'react-icons/bi';
import { HiOutlinePencilAlt as CreateIcon } from 'react-icons/hi'
import { CgProfile as ProfileIcon } from 'react-icons/cg';

import styles from './menu.module.scss';
import MenuOption from '../options/MenuOption';
import { NextRouter, useRouter } from 'next/router';

type Props = {
    open: Function
}

function Menu({ open }: Props)
{
    return (
        <div className={styles["waterfall-menu"]}>
            <MenuOption text='Join Us' icon={<JoinIcon />} modifier="join" callback={() => open(0)} />
            <MenuOption text='New Game' icon={<CreateIcon />} modifier="create" callback={() => open(1)} />
            <MenuOption text='Your Profile' icon={<ProfileIcon />} modifier="profile" callback={() => open(2)} />
        </div>
    )
}

export default Menu