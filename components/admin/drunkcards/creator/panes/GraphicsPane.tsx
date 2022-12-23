import GradientInput from 'components/shared/input/gradient';
import GradientSlider from 'components/shared/input/gradient/slider';
import { getGradientCSS, GradientPosition, GradientSetting, INITIAL_GRADIENT, toGradientCSS } from 'components/shared/input/gradient/slider/GradientSlider';
import SwitchInput from 'components/shared/input/switch';
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
    onColourChange: (col: string) => void,
    onGradientChange: (grads: { [id: string]: GradientPosition }) => void,
    defaultGradient?:GradientSetting
    type: "colour" | "gradient"
}

function GraphicsPane()
{
    const { currentPrompt: { settings, scheme }, updateCurrent } = useCreatorContext();
    const [selected, setSelected] = useState<Graphics>(Graphics.BACKGROUND);
    const [currentCol, setCurrent] = useState<string>("#FFFFFF")
    const [useGradient, setUseGradient] = useState(false)
    const [gradient, setGradient] = useState<GradientSetting>({
        angle: 45,
        type: "linear-gradient",
        gradients: {
            "test": {
                percentage: 0,
                colour: "#FE02FA",
                uuid: "test"
            },
            "yee": {
                percentage: 100,
                colour: "#ED043A",
                uuid: "test"
            }
        }
    });

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

    const onGradientChange = (grads: { [id: string]: GradientPosition }) =>
    {
        setGradient(prev =>
        {
            let temp:GradientSetting = {...prev, gradients:grads}

            console.log(Object.keys(grads).length)
            console.log(Object.keys(prev.gradients).length)

            updateCurrent({settings, scheme: {...scheme, background: getGradientCSS(temp)}, isDefault: false})
            console.log(getGradientCSS(temp))
            return temp
        })


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

    const shouldUseGradient = useGradient && selected === Graphics.BACKGROUND

    return (
        <>
            <div className={styles["graphics-pane"]}>
                <h2 className={styles["drunkcards-creator__subtitle"]}>Graphics</h2>
                <GraphicsPaneSettings
                    currentColour={currentCol}
                    onColourChange={onColourChange}
                    onGradientChange={onGradientChange}
                    defaultGradient={gradient}
                    type={shouldUseGradient ? "gradient" : "colour"}
                >
                    <GraphicsBtn active={selected === Graphics.TEXT} text='Text Colour' callback={() => switchButtons(Graphics.TEXT)} />
                    <GraphicsBtn active={selected === Graphics.BACKGROUND} text='Background' callback={() => switchButtons(Graphics.BACKGROUND)} />
                    <GraphicsBtn active={selected === Graphics.SHADOW} text='Shadow Colour' callback={() => switchButtons(Graphics.SHADOW)} />
                    {
                        selected === Graphics.BACKGROUND &&
                        <SwitchInput label='' changeCallback={() => setUseGradient(prev => !prev)} defaultValue={useGradient} />
                    }
                </GraphicsPaneSettings>
            </div>
        </>
    )
}

export function GraphicsPaneSettings({ currentColour, type = "colour", defaultGradient = INITIAL_GRADIENT, onColourChange, onGradientChange, children }: PaneSettingsProps)
{

    const isColour = type === "colour"

    return (
        <div className={styles["graphics-pane__wrapper"]}>
            <div className={styles["graphics-pane__options"]}>
                {children}
            </div>
            {
                isColour ?
                    <div className={`${styles["graphics-pane__colour"]} ${styles["graphics-pane__colour--center"]}`}>
                        <HexColorPicker
                            color={currentColour}
                            onChange={onColourChange}
                        />
                    </div> :
                    <GradientInput
                        onChange={onGradientChange}
                        sliderSettings={defaultGradient}
                    />
            }
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