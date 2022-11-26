import Backdrop from "components/shared/backdrop";
import CookieModal from "components/waterfall/lobby/modals/cookies";
import React, { PropsWithChildren, useContext, useState } from "react"



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
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState<React.ReactNode>()

    const open = () => setShow(true)
    const close = () => setShow(false)
    const updateModal = (modal: React.ReactNode) => setModal(modal)

    return (
        <ModalContext.Provider value={{ update: updateModal, open: open, close: close }}>
            {
                show &&
                <Backdrop>
                    {modal}
                </Backdrop>
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