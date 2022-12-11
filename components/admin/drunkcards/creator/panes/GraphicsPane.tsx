import useCreatorContext from 'context/drunkcards/creator/CreatorContext';
import React, { useState } from 'react'

import { HexColorPicker } from "react-colorful";

import styles from '../creator.module.scss'


export enum Graphics
{
    BACKGROUND,
    TEXT,
    SHADOW
}

type BtnProps = {
    text: string,
    active?: boolean
    callback: () => void
}

type PaneSettingsProps = React.PropsWithChildren & {
    currentColour: string,
    onColourChange: (col: string) => void

}

function GraphicsPane()
{
    const { currentPrompt: { settings, scheme, isDefault }, updateCurrent } = useCreatorContext();
    const [selected, setSelected] = useState<Graphics>(Graphics.BACKGROUND);
    const [currentCol, setCurrent] = useState<string>("#FFFFFF")

    const onColourChange = (e: string) =>
    {
        switch (selected)
        {
            case Graphics.BACKGROUND:
                updateCurrent({ settings, scheme: { ...scheme, background: e }, isDefault: false })
                break;
            case Graphics.TEXT:
                updateCurrent({ settings, scheme: { ...scheme, text: e }, isDefault: false })
                break;
            case Graphics.SHADOW:
                updateCurrent({ settings, scheme: { ...scheme, shadow: e }, isDefault: false })
                break;
            default:
                break;
        }
        setCurrent(e)
    }

    const switchButtons = (e: Graphics) =>
    {
        setSelected(e)
        if (scheme === undefined) return;
        switch (e)
        {
            case Graphics.TEXT: setCurrent(scheme.text ?? "#FFFFFF"); break;
            case Graphics.BACKGROUND: setCurrent(scheme.background ?? "#FFFFFF"); break;
            case Graphics.SHADOW: setCurrent(scheme.shadow ?? "#FFFFFF"); break;
        }
    }

    return (
        <>
            <div className={styles["graphics-pane"]}>
                <h2 className={styles["drunkcards-creator__subtitle"]}>Graphics</h2>
                <GraphicsPaneSettings
                    currentColour={currentCol}
                    onColourChange={onColourChange}
                >
                    <GraphicsBtn active={selected === Graphics.TEXT} text='Text Colour' callback={() => switchButtons(Graphics.TEXT)} />
                    <GraphicsBtn active={selected === Graphics.BACKGROUND} text='Background' callback={() => switchButtons(Graphics.BACKGROUND)} />
                    <GraphicsBtn active={selected === Graphics.SHADOW} text='Shadow Colour' callback={() => switchButtons(Graphics.SHADOW)} />
                </GraphicsPaneSettings>
            </div>
        </>
    )
}

export function GraphicsPaneSettings({ currentColour, onColourChange, children }: PaneSettingsProps)
{
    return (
        <div className={styles["graphics-pane__wrapper"]}>
            <div className={styles["graphics-pane__options"]}>
                {children}
            </div>
            <div className={`${styles["graphics-pane__colour"]} ${styles["graphics-pane__colour--center"]}`}>
                <HexColorPicker
                    color={currentColour}
                    onChange={onColourChange}
                />
            </div>
        </div>
    )
}

export function GraphicsBtn({ text, active, callback }: BtnProps)
{

    const click = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        callback()
        e.currentTarget.blur()
    }

    return (
        <button
            className={`${styles["drunkcards-creator__btn"]} ${active ? styles["drunkcards-creator__btn--active"] : ""}`}
            onClick={click}
        >
            {text}
        </button>
    )
}

export default GraphicsPane