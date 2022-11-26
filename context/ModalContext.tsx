
import Backdrop from "components/shared/backdrop";
import { domAnimation, LazyMotion } from "framer-motion";
import React, { lazy, PropsWithChildren, useContext, useState } from "react"



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

                    <Backdrop closeCallback={close}>
                        {modal}
                    </Backdrop>
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