import Modal from 'components/shared/modal'
import React from 'react'

type Props = {}

function WelcomeModal({ }: Props)
{
    return (
        <Modal
            title='Welcome'
            customColors={{
                icon:"#caf0f8",
                accent: "lightgrey",
                text: "white"
            }}
            closeBtn
            horizontal
        >
            <div className="welcome-modal">
                
            </div>
        </Modal>
    )
}

export default WelcomeModal