import useCreatorContext from 'context/drunkcards/creator/CreatorContext';
import React, { useState } from 'react'
import { CirclePicker, Color, ColorResult, SliderPicker } from 'react-color';

import styles from '../creator.module.scss'


enum Graphics
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

function GraphicsPane()
{
    const { currentPrompt: { settings, scheme }, updateCurrent } = useCreatorContext();
    const [selected, setSelected] = useState<Graphics>(Graphics.BACKGROUND);
    const [currentCol, setCurrent] = useState<Color>("#FFFFFF")

    const onColourChange = (e: ColorResult) =>
    {
        switch (selected)
        {
            case Graphics.BACKGROUND:
                updateCurrent({ settings, scheme: { ...scheme, background: e.hex } })
                break;
            case Graphics.TEXT:
                updateCurrent({ settings, scheme: { ...scheme, text: e.hex } })
                break;
            case Graphics.SHADOW:
                updateCurrent({ settings, scheme: { ...scheme, shadow: e.hex } })
                break;
            default:
                break;
        }
        setCurrent(e.hex)
    }

    return (
        <>
            <div className={styles["drunkcards-creator__graphics"]}>
                <h2 className={styles["drunkcards-creator__subtitle"]}>Graphics</h2>
                <div className={styles["drunkcards-creator__buttons"]}>
                    <GraphicsBtn
                        text='Background'
                        callback={() => setSelected(Graphics.BACKGROUND)}
                        active={selected === Graphics.BACKGROUND}
                    />
                    <GraphicsBtn
                        text='Text Colour'
                        callback={() => setSelected(Graphics.TEXT)}
                        active={selected === Graphics.TEXT}
                    />
                    <GraphicsBtn
                        text='Shadow Colour'
                        callback={() => setSelected(Graphics.SHADOW)}
                        active={selected === Graphics.SHADOW}
                    />

                </div>
                <div className={styles["drunkcards-creator__colour"]}>
                    <SliderPicker
                        onChange={onColourChange}
                        color={currentCol}
                    />
                    <CirclePicker
                        onChange={onColourChange}
                        circleSize={25}
                        color={currentCol}
                        circleSpacing={0}
                        styles={{
                            default: {
                                card: {
                                    gap: "0.25rem",
                                    columnGap: ".5rem",
                                    width: "100%"
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

function GraphicsBtn({ text, active, callback }: BtnProps)
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