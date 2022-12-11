import Advert from 'components/shared/ads/Advert'
import BuyUsBeer from 'components/shared/buyusbeer'
import ProgressBar from 'components/shared/input/progress'
import Modal from 'components/shared/modal/Modal'
import React, { useEffect, useState } from 'react'

import { AiOutlineDollar } from 'react-icons/ai'

import styles from './ad-modal.module.scss'

type Props = {
    adTime: number
    callback?: () => void
}

function AdModal({ adTime, callback = () => { } }: Props)
{
    const [time, setTime] = useState(0)

    const stop = (id: NodeJS.Timer) =>
    {
        clearInterval(id)
    }

    const timer = () =>
    {
        let id = setInterval(() =>
        {

            setTime(prev =>
            {
                if (prev + .5 > adTime)
                {
                    stop(id)
                    callback()
                }
                return prev + .5
            })
        }, 500)
    }

    useEffect(() =>
    {
        timer()
    }, [])

    const progress = (time / adTime) * 100
    const timeLeft = adTime - Math.floor(time);

    return (
        <Modal
            icon={<AiOutlineDollar />}
            customColors={{
                accent: "linear-gradient(125deg, rgba(116,242,206,1) 0%, rgba(170,246,131,1) 100%)",
                icon: "#60d394",
                text: "white"
            }}
            title='Support Us!'
        >
            <section className={`${styles["admodal"]}`}>
                <div className={styles["admodal__support"]}>
                    <h1 className={`${styles["admodal__title"]}`}>Support Us!</h1>
                    <p className={`${styles["admodal__text"]}`}>
                        By waiting 5 seconds, we are gaining your support through adverts.<br />
                        This site uses all revenue gained to pump back into Drinkers for everyone&apos;s enjoyment!
                    </p>
                    <ProgressBar
                        progress={progress}
                        label={`${timeLeft} Second${timeLeft !== 1 ? "s" : ""}`}
                        scheme={{ labelAlign: "center" }}

                    />
                </div>
                <aside className={`${styles["admodal__advert"]}`}>
                    {/* <Advert type='banner' /> */}
                    <BuyUsBeer />
                </aside>
            </section>




        </Modal>
    )
}

export default AdModal