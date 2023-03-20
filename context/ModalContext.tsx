
// import Backdrop from "components/shared/backdrop";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { lazy, PropsWithChildren, ReactNode, Suspense, useContext, useState } from "react"

const Backdrop = dynamic(() => import("components/shared/backdrop"), { suspense: true, ssr: false })

interface ModalContextProps
{
    update: (modal: ReactNode, backdrop?: boolean) => void,
    open: () => void,
    close: () => void,
}

const initial: ModalContextProps = {
    update: () => { },
    close: () => { },
    open: () => { },

}



const ModalContext = React.createContext<ModalContextProps>(initial)

function ModalContextProvider({ children }: PropsWithChildren)
{
    const [modal, setModal] = useState<React.ReactNode>()
    const [show, setShow] = useState(false);
    const [backdrop, setShowBackdrop] = useState(true);

    const open = () => setShow(true)
    const close = () => setShow(false)
    const updateModal = (modal: React.ReactNode, backdrop?: boolean) =>
    {
        setModal(modal)
        setShowBackdrop(backdrop ?? true)
    }

    return (
        <ModalContext.Provider value={{ update: updateModal, open, close }}>
            {
                show &&
                <LazyMotion features={domAnimation}>
                    {
                        backdrop ?
                            <Suspense fallback="">
                                <Backdrop closeCallback={close}>
                                    {modal}
                                </Backdrop>

                            </Suspense> :
                            modal
                    }
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

export default React.memo(ModalContextProvider)