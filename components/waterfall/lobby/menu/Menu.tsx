import React, { useEffect, useState } from 'react'

import { BiDrink as JoinIcon } from '@react-icons/all-files/bi/BiDrink';
import { HiOutlinePencilAlt as CreateIcon } from '@react-icons/all-files/hi/HiOutlinePencilAlt'
import { CgProfile as ProfileIcon } from '@react-icons/all-files/cg/CgProfile';

import styles from './menu.module.scss';
import MenuOption from '../options/MenuOption';
import { useRouter } from 'next/router';
import { createWaterfallGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';

type Props = {
    open: Function
}

function Menu({ open }: Props)
{
    const [user, setUser] = useState<User>()

    const router = useRouter();

    const create = async () =>
    {
        let response = await createWaterfallGame({
            owner: { uuid: user?.uuid ?? "", username: user?.username ?? "", avatar: user?.avatar ?? "" }, settings: {
                gameName: "Waterfall",
                hiddenBack: false,
                maxPlayers: 8,
                actionsEnabled: true
            }
        });

        if (!response) return;

        router.push("/waterfall/" + response);
    }

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    return (
        <div className={styles["waterfall-menu"]}>
            <MenuOption text='Join Us' icon={<JoinIcon />} modifier="join" callback={() => open(0)} />
            <MenuOption text='New Game' icon={<CreateIcon />} modifier="create" callback={() => create()} />
            <MenuOption text='Your Profile' icon={<ProfileIcon />} modifier="profile" callback={() => open(2)} />
        </div>
    )
}

export default Menu