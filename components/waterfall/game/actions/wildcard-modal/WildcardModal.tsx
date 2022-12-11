import Modal from 'components/shared/modal'
import React, { useEffect, useState } from 'react'
import { FaChevronUp } from 'react-icons/fa';
import { WaterfallCard } from 'redux/waterfall/types';
import { clearInterval } from 'timers';
import WaterfallPlayingCard, { Suites } from '../../card/WaterfallCard';

import { motion, Variants } from 'framer-motion';

import styles from './wildcard-modal.module.scss'
import { uuid } from 'uuidv4';
import { getCurrentGame } from 'services/waterfall/GameController';
import { getUser, User } from 'utils/UserUtil';

type Props = {
    cards: {
        [id: number]: WaterfallCard
    }

}

type WildcardCardItemProps = {
    card: WaterfallCard,
    index: number
}

let interval: any

function WildcardModal({ cards }: Props)
{
    const [icon, setIcon] = useState(0);

    let cardItems: React.ReactNode[] = []

    for (let i = 0; i < Object.keys(cards).length; i++)
    {
        let card = cards[i]

        cardItems.push(
            <WildcardCardItem card={card} index={i} />
        )
    }

    return (
        <Modal
            closeBtn
            horizontal
            icon={Suites[icon].icon}
            customColors={{
                accent: "#99d98c",
                icon: "#b5e48c",
                text: icon > 1 ? "black" : "darkred"
            }}
            title='Wildcard'
            closeClbck={() => { getCurrentGame().closeModal() }}
        >
            <div className={styles["wildcard-modal"]}>
                <div className={styles["wildcard-modal__cards"]}>
                    {cardItems}
                </div>
            </div>
        </Modal>
    )
}



function WildcardCardItem({ card, index }: WildcardCardItemProps)
{
    const variant: Variants = {
        init: {
            opacity: 0,
            y: "-5vh"
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: .25,
                delay: 0.25 * index
            }
        }
    }

    const click = (e: React.MouseEvent<HTMLDivElement>) =>
    {
        e.stopPropagation();
        getCurrentGame().sendWildcardRequest(card)
        getCurrentGame().closeModal()
    }



    return (
        <motion.div className={styles["wildcard-modal__cards__item"]}
            key={uuid()}
            variants={variant}
            initial="init"
            animate="animate"
        >
            <div className={styles["wildcard-modal__card-wrapper"]} onClick={click}>
                <WaterfallPlayingCard
                    cardDetails={{ face: card.face, suite: card.suite, hidden: false }}
                    ruleDetails={{ title: card.details.title, description: card.details.description }}
                    flipSettings={{
                        onCreation: {
                            flip: true,
                            delay: 500 * (index == 0 ? 1 : index + 1)
                        },
                        clickable: false
                    }}
                />
            </div>

        </motion.div>
    )
}

export default WildcardModal