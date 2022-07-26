import React, { lazy, Suspense } from 'react'

import { LazyMotion } from 'framer-motion'

const domAnimation = () => import("components/shared/util").then(res => res.default)
const Backdrop = lazy(() => import("components/shared/backdrop"))

const JoinModal = lazy(() => import("./join"));
const ProfileModal = lazy(() => import("./profile"))
const CookieModal = lazy(() => import("./cookies"))

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
                    <Suspense>
                        <Backdrop closeCallback={close}>
                            {modal}
                        </Backdrop>
                    </Suspense>
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
        case 2:
            return <ProfileModal close={close} />
        case 3:
            return <CookieModal />
        default:
            return undefined;
    }
}

export default LobbyModalWrapper