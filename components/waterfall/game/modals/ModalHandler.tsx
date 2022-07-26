import { LazyMotion } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { useAppSelector } from "redux/store";
import { selectModal } from "redux/waterfall/slice";
import { WaterfallModal } from "redux/waterfall/types";
import { getCurrentGame } from "services/waterfall/GameController";

const Backdrop = lazy(() => import("components/shared/backdrop"))
const DateModal = lazy(() => import("../actions/date-modal"))
const RuleModal = lazy(() => import("../actions/rule-modal"))
const WildcardModal = lazy(() => import("../actions/wildcard-modal"))
const HelpModal = lazy(() => import("./help-modal"))


const domAnimation = () => import("components/shared/util").then(res => res.default)

function ModalHandler()
{
    let modalState = useAppSelector(selectModal);
    let modal: React.ReactNode = getModal(getCurrentGame().closeModal, modalState);

    return (
        <>
            {
                modalState?.show &&
                <LazyMotion features={domAnimation}>
                    <Suspense>
                        <Backdrop closeCallback={getCurrentGame().closeModal}>
                            {modal}
                        </Backdrop>
                    </Suspense>
                </LazyMotion>
            }
        </>
    )
}




function getModal(close: Function, modal: WaterfallModal | undefined): React.ReactNode
{
    if (modal === undefined)
        return undefined;
    switch (modal.id)
    {
        case 0: {
            return <HelpModal />
        }
        case 1: {
        }
        case 2: {
            return <DateModal dates={modal.content.dates} players={modal.content.players} closeCallback={close} />
        }
        case 3: {
            return <RuleModal suggestions={modal.content.suggestions} closeCallback={close} />
        }
        case 4: {
            return <WildcardModal cards={modal.content.cards} />
        }
        default: {
            return undefined;
        }
    }

}

export default ModalHandler