import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import PlayingCard, { CardStyle } from 'components/shared/playing-card/PlayingCard'

import styles from './lobby.module.scss'
import { getHigherLowerInstance } from 'services/hi-lo/game/HiLoGameController'
import useUser from 'context/UserContext'
import { useAppSelector } from 'redux/store'
import { HiLoSelectors } from 'services/hi-lo/redux/slice'

import { v4 } from 'uuid'

type Props = {}

const poolTable = ["#008eba", "#137547", "#800080"]

const cardThemes: CardStyle[][] = [
  [
    {
      card: {
        cardBackground: "#1b1b1b",
      },
      pips: {
        color: "#e01e37",
        size: "1.75rem"
      }
    },
    {
      card: {
        cardBackground: "#1b1b1b",
      },
      pips: {
        color: "#dee2e6",
        size: "1.75rem"
      }
    }
  ],
  [
    {
      card: {
        cardBackground: "rgb(243, 238, 238)",
      },
      pips: {
        color: "#e01e37",
        size: "1.75rem"
      }
    },
    {
      card: {
        cardBackground: "rgb(243, 238, 238)",
      },
      pips: {
        color: "#2a2a2a",
        size: "1.75rem"
      }
    }
  ]
]

function Lobby({ }: Props)
{

  let owner = useAppSelector(HiLoSelectors.owner)
  const { user } = useUser();

  const start = () =>
  {
    if (!user) return;
    getHigherLowerInstance().sendGameStateRequest(true, user.uuid)
  }

  const isOwner = user && (user.uuid === owner)

  return (
    <div className={styles["hilo-lobby"]}>
      {
        isOwner &&
        <div className={styles["hilo-lobby__settings"]}>
          <button className={styles["hilo-lobby__btn"]} onClick={start}>Start</button>
        </div>
      }
      <div className={styles["hilo-lobby__themes"]}>
        <ThemeSelector />
      </div>

    </div>
  )
}

function ThemeSelector()
{

  const theme = useAppSelector(HiLoSelectors.theme);

  const [cardStyle, setCardStyle] = useState<CardStyle[]>();
  const [hoverStyle, setHoverStyle] = useState<CardStyle[] | undefined>(undefined);

  const [showCard, setShowCard] = useState(false)
  const [showEditor, setShowEditor] = useState(false);
  const { user } = useUser()

  const sendTable = (color: string) =>
  {
    if (!user) return
    getHigherLowerInstance().sendTableAdjust(color, user.uuid)
  }

  const sendCardTheme = (cardStyle: CardStyle[]) =>
  {
    if (!user) return;

    let style = cardStyle;

    style.forEach(e =>
    {
      if (!e.card) return;
      e.card.width = undefined
      e.card.height = undefined
    })

    getHigherLowerInstance().sendCardTheme(style, user.uuid)

  }

  useEffect(() =>
  {
    setCardStyle([theme.red, theme.black])
  }, [theme])

  const showCardStyle = hoverStyle ? hoverStyle : cardStyle
  const isCardSelected = (cardTheme: CardStyle) => (theme.black.card?.cardBackground === cardTheme.card?.cardBackground) ?? false
  const isCustomTable = !poolTable.includes(theme.table)

  return (
    <>
      <div className={styles["hilo-lobby__theme"]}>
        <span className={styles["hilo-lobby__subtitle"]}>Table Cloth</span>
        <div className={styles["theme-selector"]}>
          {
            poolTable.map(e =>
            {
              let selected = e === theme.table
              return (
                <button key={v4()} className={`${styles["theme-selector__btn"]} ${selected ? styles["theme-selector__btn--selected"] : ""}`} style={{ background: e }} onClick={() => sendTable(e)} />
              )
            })
          }
          {
            showEditor &&
            <div className={styles["theme-selector__editor"]}>
              <HexColorPicker color={theme.table} onChange={(col) => sendTable(col)} />
            </div>
          }
          <button className={`${styles["theme-selector__btn"]} ${isCustomTable ? styles["theme-selector__btn--selected"] : ""}`} onClick={() => setShowEditor(prev => !prev)} />
        </div>
      </div>
      <div className={styles["hilo-lobby__theme"]} onMouseEnter={() => setShowCard(true)} onMouseLeave={() => setShowCard(false)}>
        <span className={styles["hilo-lobby__subtitle"]}>Card Theme</span>
        <div className={styles["theme-selector"]}>
          <button
            className={`${styles["theme-selector__btn"]} ${isCardSelected(cardThemes[1][0]) ?
                styles["theme-selector__btn--selected"] + " " + styles["theme-selector__btn--selected--black"] : ""
              }`}
            style={{ background: "white" }} onClick={() => sendCardTheme(cardThemes[1])}
            onMouseEnter={() => setHoverStyle(cardThemes[1])} onMouseLeave={() => setHoverStyle(undefined)}
          />

          <button className={`${styles["theme-selector__btn"]} ${isCardSelected(cardThemes[0][0]) ?
              styles["theme-selector__btn--selected"] : ""}`}
            style={{ background: "#1b1b1b", border: "2px solid white" }} onClick={() => sendCardTheme(cardThemes[0])}
            onMouseEnter={() => setHoverStyle(cardThemes[0])} onMouseLeave={() => setHoverStyle(undefined)}
          />
        </div>
        {
          showCard && showCardStyle &&
          <motion.div className={styles["hilo-lobby__cards"]}
            initial={{ scale: 0.85, translateY: "-100%" }} animate={{ scale: 1 }}
          >
            <PlayingCard
              settings={{
                face: 5,
                suite: 0
              }}
              cardStyles={{
                black: {
                  ...showCardStyle[1],
                  card: {
                    ...showCardStyle[1].card,
                    width: "10rem",
                    height: `calc(10rem * 1.4)`,
                  }
                },
                red: {
                  ...showCardStyle[0],
                  card: {
                    ...showCardStyle[0].card,

                    width: "10rem",
                    height: `calc(10rem * 1.4)`
                  }
                }
              }}
            />
            <PlayingCard
              settings={{
                face: 5,
                suite: 2
              }}
              cardStyles={{
                black: {
                  ...showCardStyle[1],
                  card: {
                    ...showCardStyle[1].card,
                    width: "10rem",
                    height: `calc(10rem * 1.4)`,
                  }
                },
                red: {
                  ...showCardStyle[0],
                  card: {
                    ...showCardStyle[0].card,

                    width: "10rem",
                    height: `calc(10rem * 1.4)`
                  }
                }
              }}
            />
          </motion.div>
        }
      </div>
    </>
  )
}

export default Lobby