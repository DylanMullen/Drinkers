import React from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { GiCardRandom, GiWaterfall } from 'react-icons/gi'
import Section from '../section'

import styles from './game-selector.module.scss'
import GameSelectorItem from './item/GameSelectorItem'

export type FeaturedGame = {
    name: string,
    description: string,
    icon: React.ReactNode,
    color: string,
    link: string,
    disabled?: boolean

}

const FeaturedGames: { [id: number]: FeaturedGame } = {
    0: {
        name: "Waterfall",
        description: "Our version of Kings Cup. 52 Cards, 52 Possibilities to drink! Got time to burn?",
        icon: <GiWaterfall />,
        color: "#bde0fe",
        link: "/waterfall"
    },
    1: {
        name: "Drunkcards",
        description: "An infinite number of cards from our custom packs. Do you dare?",
        icon: <GiCardRandom />,
        color: "#aaf683",
        link: "/drunkcards"
    },
    2: {
        name: "Higher N' Lower",
        description: "Guess what the next number is. Are you lucky? Test your luck. Coming Soon!",
        icon: <BsGraphUp />,
        color: "#ccff33",
        link: "/",
        disabled: true
    }
}



function GameSelector()
{

    let games: React.ReactNode[] = []

    let delay = 0;

    for (let index = 0; index < Object.keys(FeaturedGames).length; index++)
    {
        const element = FeaturedGames[index];
        games.push(
            <GameSelectorItem key={(Math.random() * 100) * index} {...element} delay={delay} />
        )
        delay += 0.25
    }

    return (
        <Section id='' title='Featured Games'
            scheme={{
                background: "rgba(62,62,62,1)",
                transformY: "150px",
            }}
        >
            <div className={styles["game-selector"]}>
                <p className={styles["game-selector__text"]}>
                    Here at Drinkers, we take pride in our ways to get you drunk.<br />
                </p>

                <ul className={styles["game-selector__games"]} data-columns={games.length >= 4 ? 4 : games.length}>
                    {games}
                    <p className={styles["game-selector__soon"]}>More Coming Soon!</p>
                </ul>

                <div className={styles["game-selector__footer"]}>
                    <svg id="visual" viewBox="0 0 900 150" width="100%" height="150px" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <defs>
                            <filter id="shadow" filterUnits="userSpaceOnUse">
                                <feDropShadow dx="0.2" dy="0.4" stdDeviation="8" floodColor={"rgba(0,0,0,0.5)"} />
                            </filter>
                        </defs>


                        <path d="M0 127L6.5 114.5C13 102 26 77 39 66.2C52 55.3 65 58.7 78 66.2C91 73.7 104 85.3 117.2 91C130.3 96.7 143.7 96.3 156.8 101.8C170 107.3 183 118.7 196 118.5C209 118.3 222 106.7 235 102.8C248 99 261 103 274 109.3C287 115.7 300 124.3 313 130.3C326 136.3 339 139.7 352 135C365 130.3 378 117.7 391 109.5C404 101.3 417 97.7 430.2 99.3C443.3 101 456.7 108 469.8 101.7C483 95.3 496 75.7 509 68.3C522 61 535 66 548 77.8C561 89.7 574 108.3 587 105C600 101.7 613 76.3 626 77.8C639 79.3 652 107.7 665 115.8C678 124 691 112 704 103.8C717 95.7 730 91.3 743.2 90.2C756.3 89 769.7 91 782.8 87.5C796 84 809 75 822 78.5C835 82 848 98 861 101.5C874 105 887 96 893.5 91.5L900 87L900 0L893.5 0C887 0 874 0 861 0C848 0 835 0 822 0C809 0 796 0 782.8 0C769.7 0 756.3 0 743.2 0C730 0 717 0 704 0C691 0 678 0 665 0C652 0 639 0 626 0C613 0 600 0 587 0C574 0 561 0 548 0C535 0 522 0 509 0C496 0 483 0 469.8 0C456.7 0 443.3 0 430.2 0C417 0 404 0 391 0C378 0 365 0 352 0C339 0 326 0 313 0C300 0 287 0 274 0C261 0 248 0 235 0C222 0 209 0 196 0C183 0 170 0 156.8 0C143.7 0 130.3 0 117.2 0C104 0 91 0 78 0C65 0 52 0 39 0C26 0 13 0 6.5 0L0 0Z" fill="#2a2a2a" filter='url(#shadow)' />
                        <path d="M0 105L6.5 105.7C13 106.3 26 107.7 39 98.8C52 90 65 71 78 60C91 49 104 46 117.2 44.3C130.3 42.7 143.7 42.3 156.8 50C170 57.7 183 73.3 196 79.8C209 86.3 222 83.7 235 84.2C248 84.7 261 88.3 274 80.5C287 72.7 300 53.3 313 50.3C326 47.3 339 60.7 352 66.7C365 72.7 378 71.3 391 71.7C404 72 417 74 430.2 80.3C443.3 86.7 456.7 97.3 469.8 94.3C483 91.3 496 74.7 509 67.7C522 60.7 535 63.3 548 67.3C561 71.3 574 76.7 587 75C600 73.3 613 64.7 626 66.8C639 69 652 82 665 84C678 86 691 77 704 75.7C717 74.3 730 80.7 743.2 88.7C756.3 96.7 769.7 106.3 782.8 108.7C796 111 809 106 822 103.7C835 101.3 848 101.7 861 94.2C874 86.7 887 71.3 893.5 63.7L900 56L900 0L893.5 0C887 0 874 0 861 0C848 0 835 0 822 0C809 0 796 0 782.8 0C769.7 0 756.3 0 743.2 0C730 0 717 0 704 0C691 0 678 0 665 0C652 0 639 0 626 0C613 0 600 0 587 0C574 0 561 0 548 0C535 0 522 0 509 0C496 0 483 0 469.8 0C456.7 0 443.3 0 430.2 0C417 0 404 0 391 0C378 0 365 0 352 0C339 0 326 0 313 0C300 0 287 0 274 0C261 0 248 0 235 0C222 0 209 0 196 0C183 0 170 0 156.8 0C143.7 0 130.3 0 117.2 0C104 0 91 0 78 0C65 0 52 0 39 0C26 0 13 0 6.5 0L0 0Z" fill="#313131" />
                        <path d="M0 40L6.5 40.7C13 41.3 26 42.7 39 48.2C52 53.7 65 63.3 78 59C91 54.7 104 36.3 117.2 36.7C130.3 37 143.7 56 156.8 61.7C170 67.3 183 59.7 196 58.5C209 57.3 222 62.7 235 66.3C248 70 261 72 274 65C287 58 300 42 313 34C326 26 339 26 352 27.3C365 28.7 378 31.3 391 39.3C404 47.3 417 60.7 430.2 62.7C443.3 64.7 456.7 55.3 469.8 53.3C483 51.3 496 56.7 509 63.3C522 70 535 78 548 81.7C561 85.3 574 84.7 587 75.8C600 67 613 50 626 46.3C639 42.7 652 52.3 665 57.2C678 62 691 62 704 60C717 58 730 54 743.2 49.8C756.3 45.7 769.7 41.3 782.8 37.3C796 33.3 809 29.7 822 26.3C835 23 848 20 861 28.5C874 37 887 57 893.5 67L900 77L900 0L893.5 0C887 0 874 0 861 0C848 0 835 0 822 0C809 0 796 0 782.8 0C769.7 0 756.3 0 743.2 0C730 0 717 0 704 0C691 0 678 0 665 0C652 0 639 0 626 0C613 0 600 0 587 0C574 0 561 0 548 0C535 0 522 0 509 0C496 0 483 0 469.8 0C456.7 0 443.3 0 430.2 0C417 0 404 0 391 0C378 0 365 0 352 0C339 0 326 0 313 0C300 0 287 0 274 0C261 0 248 0 235 0C222 0 209 0 196 0C183 0 170 0 156.8 0C143.7 0 130.3 0 117.2 0C104 0 91 0 78 0C65 0 52 0 39 0C26 0 13 0 6.5 0L0 0Z" fill="#373737" />
                        <path d="M0 54L6.5 50.2C13 46.3 26 38.7 39 30C52 21.3 65 11.7 78 9.8C91 8 104 14 117.2 13.7C130.3 13.3 143.7 6.7 156.8 3.3C170 0 183 0 196 8C209 16 222 32 235 39.8C248 47.7 261 47.3 274 39.7C287 32 300 17 313 14.2C326 11.3 339 20.7 352 24.8C365 29 378 28 391 32C404 36 417 45 430.2 49.3C443.3 53.7 456.7 53.3 469.8 49.8C483 46.3 496 39.7 509 33.3C522 27 535 21 548 23.2C561 25.3 574 35.7 587 36.2C600 36.7 613 27.3 626 21.2C639 15 652 12 665 12.3C678 12.7 691 16.3 704 16.3C717 16.3 730 12.7 743.2 17.7C756.3 22.7 769.7 36.3 782.8 35.3C796 34.3 809 18.7 822 19.7C835 20.7 848 38.3 861 43C874 47.7 887 39.3 893.5 35.2L900 31L900 0L893.5 0C887 0 874 0 861 0C848 0 835 0 822 0C809 0 796 0 782.8 0C769.7 0 756.3 0 743.2 0C730 0 717 0 704 0C691 0 678 0 665 0C652 0 639 0 626 0C613 0 600 0 587 0C574 0 561 0 548 0C535 0 522 0 509 0C496 0 483 0 469.8 0C456.7 0 443.3 0 430.2 0C417 0 404 0 391 0C378 0 365 0 352 0C339 0 326 0 313 0C300 0 287 0 274 0C261 0 248 0 235 0C222 0 209 0 196 0C183 0 170 0 156.8 0C143.7 0 130.3 0 117.2 0C104 0 91 0 78 0C65 0 52 0 39 0C26 0 13 0 6.5 0L0 0Z" fill="#3e3e3e" />
                    </svg>
                </div>

            </div>
        </Section>

    )
}

export default GameSelector