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
import GraphicsPane from './panes/GraphicsPane'
import { BsCheck2Circle } from 'react-icons/bs'
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import Tooltip from 'components/shared/tooltip'

type Props = {}

type NavItem = {
  icon: React.ReactNode,
  tooltip: {
    text: string
    direction: "left" | "right"
  },
  callback: () => void
}



function Creator({ }: Props)
{
  const { currentPrompt, prompts, addCurrentPrompt, resetCurrent, removePrompt } = useCreatorContext();
  const [pane, updatePane] = useState<React.ReactNode>(<SettingsPane />);

  const editing = prompts[currentPrompt.settings.uuid] !== undefined;

  const add = () =>
  {
    addCurrentPrompt()
    updatePane(<SettingsPane />)
  }

  const clear = () =>
  {
    if (editing)
    {
      removePrompt(currentPrompt.settings.uuid)
    }

    resetCurrent();
  }


  return (
    <div className={styles["drunkcards-creator"]}>
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
      <div className={styles["drunkcards-creator__input"]}>
        <nav className={`${styles["drunkcards-creator__nav"]} ${styles["drunkcards-creator__nav--left"]}`}>
          <NavigationItem
            icon={<FaCog />}
            tooltip={{
              text: "Settings",
              direction: "left"
            }}
            callback={() => updatePane(<SettingsPane />)}
          />
          <NavigationItem
            icon={<IoMdBrush />}
            tooltip={{
              text: "Graphics",
              direction: "left"
            }}
            callback={() => updatePane(<GraphicsPane />)}
          />
        </nav>

        <nav className={`${styles["drunkcards-creator__nav"]} ${styles["drunkcards-creator__nav--right"]}`}>
          <NavigationItem
            icon={<FiCheckCircle />}
            tooltip={{
              text: "Add To Pack",
              direction: "right"
            }}
            callback={add} />
          <NavigationItem
            icon={!editing ? <AiOutlineClose /> : <FiTrash2 />}
            tooltip={{
              text: !editing ? "Clear Prompt" : "Delete Prompt",
              direction: "right"
            }}
            callback={clear} />
        </nav>

        <h1 className={styles["drunkcards-creator__title"]}>{!editing ? "New Prompt" : "Edit Prompt"}</h1>

        <div className={styles["drunkcards-creator__pane"]}>
          {pane}
        </div>

      </div>
    </div>
  )
}

function NavigationItem({ icon, tooltip, callback }: NavItem)
{

  return (
    <Tooltip text={tooltip.text} direction={tooltip.direction}>
      <button className={styles["drunkcards-creator__navitem"]} onClick={callback}>
        {icon}
      </button>
    </Tooltip>
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
        retriever={(title: string) => updateCurrent({ scheme, settings: { ...settings, title: title } })}
      />
      <AreaInput
        label="Description"
        placeholder={settings.description}
        callback={(desc) => updateCurrent({ scheme, settings: { ...settings, description: desc } })}
      />
    </>
  )
}

export default Creator