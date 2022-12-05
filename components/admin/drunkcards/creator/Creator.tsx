import PirateCard from 'components/pirate/game/card'
import TextInput from 'components/shared/input/text'
import AreaInput from 'components/shared/input/textarea'
import useCreatorContext from 'context/drunkcards/creator/CreatorContext'
import { CirclePicker, Color, ColorResult, HuePicker, SliderPicker, TwitterPicker } from 'react-color'
import React, { useState } from 'react'

import styles from './creator.module.scss'
import { FaCog } from 'react-icons/fa'
import { IoMdBrush } from 'react-icons/io'
import { title } from 'process'

type Props = {}

type NavItem = {
  icon: React.ReactNode,
  update: () => void
}

function Creator({ }: Props)
{
  const { currentPrompt, prompts, updateCurrent, addCurrentPrompt, removePrompt } = useCreatorContext();
  const [pane, updatePane] = useState<React.ReactNode>(<SettingsPane />);


  return (
    <div className={styles["drunkcards-creator"]}>
      <div className={styles["drunkcards-creator__input"]}>
        <nav className={styles["drunkcards-creator__nav"]}>
          <NavigationItem icon={<FaCog />} update={() => updatePane(<SettingsPane />)} />
          <NavigationItem icon={<IoMdBrush />} update={() => updatePane(<GraphicsPane />)} />
        </nav>
        <h1 className={styles["drunkcards-creator__title"]}>New Prompt</h1>

        <div className={styles["drunkcards-creator__pane"]}>
          {pane}
        </div>

      </div>
      <div className={styles["drunkcards-creator__card"]}>
        <PirateCard
          settings={{
            title: currentPrompt.settings.title,
            description: currentPrompt.settings.description,
            isDummy: true
          }}
          scheme={currentPrompt.scheme}
        />
      </div>
    </div>
  )
}

function NavigationItem({ icon, update }: NavItem)
{
  const onClick = (_: React.MouseEvent<HTMLButtonElement>) => update()

  return (
    <button className={styles["drunkcards-creator__navitem"]} onClick={update}>
      {icon}
    </button>
  )
}

function SettingsPane()
{
  const { currentPrompt: { settings, scheme }, updateCurrent } = useCreatorContext();

  return (
    <>
      <h2 className={styles["drunkcards-creator__subtitle"]}>Settings</h2>
      <TextInput
        label="Title"
        placeholder={settings.title}
        retriever={(title: string) => updateCurrent({ ...scheme, settings: { ...settings, title: title } })}
      />
      <AreaInput
        label="Description"
        placeholder={settings.description}
        callback={(desc) => updateCurrent({ ...scheme, settings: { ...settings, description: desc } })}
      />
    </>
  )
}

function GraphicsPane()
{
  const { currentPrompt: { settings, scheme }, updateCurrent } = useCreatorContext();
  const [selected, setSelected] = useState("background");
  const [currentCol, setCurrent] = useState<Color>("#FFFFFF")

  const onColourChange = (e: ColorResult) =>
  {
    let col = e
    switch (selected)
    {
      case "background":
        updateCurrent({ settings, scheme: { ...scheme, background: e.hex } })
        break;
      case "text":
        updateCurrent({ settings, scheme: { ...scheme, text: e.hex } })
        break;
      case "shadow":
        updateCurrent({ settings, scheme: { ...scheme, shadow: e.hex } })
        break;
      default:
        break;
    }
    setCurrent(e.hex)
  }

  return (
    <>
      <h2 className={styles["drunkcards-creator__subtitle"]}>Graphics</h2>
      <div className={styles["drunkcards-creator__buttons"]}>
        <button
          className={styles["drunkcards-creator__btn"]}
          onClick={() => setSelected("background")}>Background</button>
        <button
          className={styles["drunkcards-creator__btn"]}
          onClick={() => setSelected("text")}>Text Colour</button>
        <button
          className={styles["drunkcards-creator__btn"]}
          onClick={() => setSelected("shadow")}>Shadow Colour</button>
      </div>
      <div className={styles["drunkcards-creator__colour"]}>
        <SliderPicker
          onChange={onColourChange}
          color={currentCol}

        />
        <CirclePicker
          onChange={onColourChange}
          circleSize={25}
          circleSpacing={0}
          styles={{
            default: {
              card: {
                gap: "0.25rem",
                columnGap: ".5rem"
              }
            }
          }}
        />
      </div>
    </>
  )
}

export default Creator