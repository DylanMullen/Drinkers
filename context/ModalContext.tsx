
// import Backdrop from "components/shared/backdrop";
import { domAnimation, LazyMotion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { lazy, PropsWithChildren, Suspense, useContext, useState } from "react"

const Backdrop = dynamic(() => import("components/shared/backdrop"), { suspense: true, ssr: false })

interface ModalContextProps
{
    update: (modal: React.ReactNode) => void,
    open: () => void,
    close: () => void
}

const initial: ModalContextProps = {
    update: () => { },
    close: () => { },
    open: () => { }
}

const ModalContext = React.createContext<ModalContextProps>(initial)

function ModalContextProvider({ children }: PropsWithChildren)
{
    const [modal, setModal] = useState<React.ReactNode>()
    const [show, setShow] = useState(false);

    const open = () => setShow(true)
    const close = () => setShow(false)
    const updateModal = (modal: React.ReactNode) => setModal(modal)

    return (
        <ModalContext.Provider value={{ update: updateModal, open: open, close: close }}>
            {
                show &&
                <LazyMotion features={domAnimation}>
                    <Suspense fallback="">
                        <Backdrop closeCallback={close}>
                            {modal}
                        </Backdrop>

                    </Suspense>
                </LazyMotion>
            }
            {children}
        </ModalContext.Provider>
    )
}

export function useModalContext()
{
    return useContext(ModalContext)
}

export default ModalContextProvider