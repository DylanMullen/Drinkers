import PlayingCard, { CardStyle } from 'components/shared/playing-card/PlayingCard';
import React from 'react'
import HiLoCard from '../card/HiLoCard'

import styles from './hilo-cards.module.scss'

type Props = {}

function HiLoCards({ }: Props)
{
    let width = 12;
    let height = 12 * 1.4

    const cardStyles: CardStyle[] = [
        {
            card: {
                cardBackground: "#2c2c2c",
                width: `${width}rem`,
                height: `${height}rem`
            },
            pips: {
                color: "#e01e37",
                size: "2rem"
            }
        },
        {
            card: {
                cardBackground: "#1b1b1b",
                width: `${width}rem`,
                height: `${height}rem`
            },
            pips: {
                color: "#dee2e6",
                size: "2rem"
            }
        }
    ]

    return (
        <div className={styles["hilo-cards"]}>
            <HiLoCard showButtons={false}>
                <PlayingCard
                    settings={{
                        face:9,
                        suite:0
                    }}
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: true }}
                />
            </HiLoCard>
            <HiLoCard showButtons >
                <PlayingCard
                    cardStyles={{ red: cardStyles[0], black: cardStyles[1] }}
                    flipSettings={{ clickable: false }}
                />
            </HiLoCard>
        </div>
    )
}

export default HiLoCards