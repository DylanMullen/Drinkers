import Backdrop from 'components/shared/backdrop/Backdrop'
import React, { useState } from 'react'
import CreateModal from './create'
import JoinModal from './join'
import ProfileModal from './profile'

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
                <Backdrop closeCallback={close}>
                    {modal}
                </Backdrop>
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
        default:
            return undefined;
    }
}

export default LobbyModalWrapper