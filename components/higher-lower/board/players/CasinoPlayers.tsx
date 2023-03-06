import InviteModal from 'components/higher-lower/modals/invite'
import Tooltip from 'components/shared/tooltip'
import { useModalContext } from 'context/ModalContext'
import useUser from 'context/UserContext'
import Image from 'next/image'
import React, { ReactNode, useState } from 'react'
import { FaCrown, FaPlus } from 'react-icons/fa'
import { GiBootKick } from 'react-icons/gi'
import { IoPersonRemove, IoShieldCheckmark } from 'react-icons/io5'
import { useAppSelector } from 'redux/store'
import { getHigherLowerInstance } from 'services/hi-lo/game/HiLoGameController'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'
import { User } from 'utils/UserUtil'

import styles from './casino-players.module.scss'

type Props = {
    users: User[]
}

type PlayerProps = {
    player?: User,
    position: number,
    isNext?: boolean,
    hasAdmin?: boolean
}

const pos2 = [4, 5, 3, 6, 2, 7, 1, 8]

function CasinoPlayers({ users }: Props)
{
    let nextPlayer = useAppSelector(HiLoSelectors.nextUser)
    let owner = useAppSelector(HiLoSelectors.settings).ownerID;

    const { user } = useUser();

    let players: ReactNode[] = []
    for (let index = 0; index < 8; index++)
    {
        let player = users[index];
        let isOwner = owner === user?.uuid

        let hasAdmin = isOwner && (player !== undefined && player.uuid !== owner)

        players.push(
            <CasinoPlayer
                player={users[index]}
                position={pos2[index]}
                isNext={users[index]?.uuid === nextPlayer ?? false}
                hasAdmin={hasAdmin}
            />
        )

    }

    return (
        <ul className={styles["casino-players"]}>
            {players}
        </ul>
    )
}

function CasinoPlayer({ player, position, isNext, hasAdmin = false }: PlayerProps)
{
    const { open, update } = useModalContext();
    const [admin, setAdminOpen] = useState(false);

    const { user } = useUser();

    const click = () =>
    {
        update(<InviteModal />)
        open()
    }

    const kick = () =>
    {
        if (!user || !player) return;
        getHigherLowerInstance().sendKickRequest(player.uuid, user.uuid)
    }

    const promote = () =>
    {
        if (!user || !player) return;
        getHigherLowerInstance().sendPromotionRequest(player.uuid, user.uuid)
    }

    return (
        <li className={`${styles["casino-player"]} ${isNext ? styles["casino-player--next"] : ""}`} data-spot={position}>
            {
                player ?
                    <>
                        <span className={styles["casino-player__avatar"]}>
                            <Image src={player?.avatar} width="100%" height="100%" />
                            {
                                hasAdmin &&
                                <>
                                    <button className={`${styles["casino-player__admin-btn"]} ${styles["casino-player__admin-btn--admin"]}`} onClick={() => setAdminOpen(prev => !prev)}>
                                        <IoShieldCheckmark />
                                    </button>
                                    {
                                        admin &&
                                        <>

                                            <button className={`${styles["casino-player__admin-btn"]} ${styles["casino-player__admin-btn--kick"]}`} onClick={kick}>
                                                <IoPersonRemove />
                                            </button>
                                            <button className={`${styles["casino-player__admin-btn"]} ${styles["casino-player__admin-btn--promote"]}`} onClick={promote}>
                                                <FaCrown />
                                            </button>
                                        </>
                                    }
                                </>
                            }
                        </span>
                        <span className={styles["casino-player__username"]}>{player?.username}</span>
                    </>
                    :
                    <>
                        <button className={styles["casino-player__new"]} onClick={click}>
                            <FaPlus />
                        </button>
                    </>
            }

        </li>
    )
}

export default CasinoPlayers