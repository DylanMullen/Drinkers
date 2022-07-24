import Backdrop from 'components/shared/backdrop/Backdrop'
import React, { useState } from 'react'
import CookieModal from './cookies'
import CreateModal from './create'
import JoinModal from './join'
import ProfileModal from './profile'

import { LazyMotion, domAnimation, } from 'framer-motion'

type Props = {
    id: number;
    close: Function
}
function LobbyModalWrapper({ id, close }: Props)
{

    let modal = getModal(id, close);

    return (
        <>
            {
                modal &&

                <LazyMotion features={domAnimation}>
                    <Backdrop closeCallback={close}>
                        {modal}
                    </Backdrop>
                </LazyMotion>
            }

        </>
    )
}

function getModal(id: number, close: Function)
{
    if (id === -1)
        return undefined;

    switch (id)
    {
        case 0:
            return <JoinModal close={close} />
        case 1:
            return <CreateModal close={close} />
        case 2:
            return <ProfileModal close={close} />
        case 3:
            return <CookieModal />
        default:
            return undefined;
    }
}

export default LobbyModalWrapper