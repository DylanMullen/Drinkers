import PlayingCard, { CardStyle } from 'components/shared/playing-card/PlayingCard';
import React from 'react'
import { useAppSelector } from 'redux/store';
import { HiLoSelectors } from 'services/hi-lo/redux/slice';
import HiLoCard from '../card/HiLoCard'

import styles from './hilo-cards.module.scss'

type Props = {}

const cardStyles: CardStyle[] = [
    {
        card: {
            cardBackground: "#2c2c2c",
            width: `${12}rem`,
            height: `${12 * 1.4}rem`
        },
        pips: {
            color: "#e01e37",
            size: "2rem"
        }
    },
    {
        card: {
            cardBackground: "#1b1b1b",
            width: `${12}rem`,
            height: `${12 * 1.4}rem`
        },
        pips: {
            color: "#dee2e6",
            size: "2rem"
        }
    }
]

function HiLoCards()
{
    let currentNumber = useAppSelector(HiLoSelectors.currentNumber)

    return (
        <div className={styles["hilo-cards"]}>
            <HiLoCard showButtons={false}>
                <PlayingCard
                    settings={{
                        face: currentNumber,
                        suite: 0
                    }}
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: false }}
                />
            </HiLoCard>
            <HiLoCard showButtons >
                <PlayingCard
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: false, defaultFlipped:true }}
                />
            </HiLoCard>
        </div>
    )
}

export default HiLoCards