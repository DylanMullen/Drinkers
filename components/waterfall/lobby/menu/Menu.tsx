import React, { useEffect, useState } from 'react'

import { BiDrink as JoinIcon } from '@react-icons/all-files/bi/BiDrink';
import { HiOutlinePencilAlt as CreateIcon } from '@react-icons/all-files/hi/HiOutlinePencilAlt'
import { CgProfile as ProfileIcon } from '@react-icons/all-files/cg/CgProfile';

import styles from './menu.module.scss';
import MenuOption from '../options/MenuOption';
import { useRouter } from 'next/router';
import { getUser, User } from 'utils/UserUtil';
import { useModalContext } from 'context/ModalContext';
import JoinModal, { GameMode } from '../modals/join/JoinModal';
import ProfileModal from '../modals/profile';

type Props = {
    create: Function,
    gameMode: GameMode
}

// const JoinModal = lazy(() => import("../modals/join"))
// const ProfileModal = lazy(() => import('../modals/profile'))

function Menu({ create, gameMode }: Props)
{
    const [user, setUser] = useState<User>()

    const { open, close, update } = useModalContext();

    useEffect(() =>
    {
        setUser(getUser())
    }, [])

    const openModal = (id: number) =>
    {
        switch (id)
        {
            case 0:
                update(<JoinModal gameMode={gameMode} close={close} />)
                break;
            case 1:
                update(<ProfileModal close={close} />)
                break;
            default:
                return;
        }
        open()
    }

    return (
        <div className={styles["waterfall-menu"]}>
            <MenuOption text='Join Us' icon={<JoinIcon />} modifier="join" callback={() => openModal(0)} />
            <MenuOption text='New Game' icon={<CreateIcon />} modifier="create" callback={() => create()} />
        </div>
    )
}

export default Menu