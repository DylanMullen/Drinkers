import PirateCard from 'components/pirate/game/card'
import TextInput from 'components/shared/input/text'
import AreaInput from 'components/shared/input/textarea'
import useCreatorContext from 'context/drunkcards/creator/CreatorContext'
import React, { useState } from 'react'

import styles from './creator.module.scss'
import { FaSave } from 'react-icons/fa'
import { IoMdBrush } from 'react-icons/io'
import GraphicsPane from './panes/GraphicsPane'
import { FiCheckCircle, FiPackage, FiTrash2 } from 'react-icons/fi'
import { AiOutlineClose, AiOutlinePlus, AiOutlinePlusCircle } from 'react-icons/ai'
import Tooltip from 'components/shared/tooltip'
import { createPack, savePack } from 'services/pirate/creator/CreatorController'
import PackPane from './panes/PackPane'

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
  const { currentPrompt, prompts, defaultScheme, addCurrentPrompt, resetCurrent, removePrompt, clearPack } = useCreatorContext();
  const [pane, updatePane] = useState<React.ReactNode>(<PackPane />);
  const [isShowingRight, setShowingRight] = useState(false);
  const [useDefaultStyling, setDefaultStyling] = useState(currentPrompt.isDefault);

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

    updatePane(<SettingsPane />)

    resetCurrent();
  }

  const save = () =>
  {
    let pack = createPack(prompts, defaultScheme);
    savePack(pack)
  }

  const movePane = (pane: React.ReactNode, defaultStyling: boolean) =>
  {
    setDefaultStyling(defaultStyling);
    setShowingRight(!defaultStyling)
    updatePane(pane)
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
          scheme={(useDefaultStyling || currentPrompt.scheme === undefined) ? defaultScheme : currentPrompt.scheme}
        />
      </div>
      <div className={styles["drunkcards-creator__input"]}>
        <nav className={`${styles["drunkcards-creator__nav"]} ${styles["drunkcards-creator__nav--left"]}`}>
          <NavigationItem
            icon={<FiPackage />}
            tooltip={{
              text: "Pack Settings",
              direction: "left"
            }}
            callback={() => movePane(<PackPane />, true)}
          />
          <NavigationItem
            icon={<AiOutlinePlusCircle />}
            tooltip={{
              text: "Settings",
              direction: "left"
            }}
            callback={() => movePane(<SettingsPane />, false)}
          />
          <NavigationItem
            icon={<IoMdBrush />}
            tooltip={{
              text: "Graphics",
              direction: "left"
            }}
            callback={() => movePane(<GraphicsPane />, false)}
          />
        </nav>
        {
          isShowingRight &&
          <nav className={`${styles["drunkcards-creator__nav"]} ${styles["drunkcards-creator__nav--right"]}`}>
            <NavigationItem
              icon={!editing ? <FiCheckCircle /> : <FaSave />}
              tooltip={{
                text: !editing ? "Add To Pack" : "Save Prompt",
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
        }

        <h1 className={styles["drunkcards-creator__title"]}>{!editing ? "New Prompt" : "Edit Prompt"}</h1>

        <div className={styles["drunkcards-creator__pane"]}>
          {pane}
        </div>
        <div className={styles["drunkcards-creator__footer"]}>
          <button className={`${styles["drunkcards-creator__footer__btn"]} ${styles["drunkcards-creator__footer__btn--save"]}`} onClick={save}>Save Pack</button>
          <button className={`${styles["drunkcards-creator__footer__btn"]} ${styles["drunkcards-creator__footer__btn--clear"]}`} onClick={clearPack}>Clear Pack</button>

        </div>
      </div>
    </div>
  )
}

function NavigationItem({ icon, tooltip, callback }: NavItem)
{

  const click = (e: React.MouseEvent<HTMLButtonElement>) =>
  {
    e.currentTarget.blur();
    callback()
  }

  return (
    <Tooltip text={tooltip.text} direction={tooltip.direction}>
      <button className={styles["drunkcards-creator__navitem"]} onClick={click}>
        {icon}
      </button>
    </Tooltip>
  )
}

function SettingsPane()
{
  const { currentPrompt: { settings, scheme, isDefault }, updateCurrent } = useCreatorContext();

  return (
    <>
      <h2 className={styles["drunkcards-creator__subtitle"]}>Settings</h2>
      <TextInput
        label="Title"
        value={settings.title}
        retriever={(title: string) => updateCurrent({ scheme, settings: { ...settings, title: title }, isDefault })}
      />
      <AreaInput
        label="Description"
        value={settings.description}
        callback={(desc) => updateCurrent({ scheme, settings: { ...settings, description: desc }, isDefault })}
      />
    </>
  )
}

export default Creator