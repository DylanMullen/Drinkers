import { GraphicsPaneSettings } from 'components/admin/drunkcards/creator/panes/GraphicsPane'
import React, { useState } from 'react'
import GradientSlider from './slider'
import { GradientPosition, GradientSetting, INITIAL_GRADIENT } from './slider/GradientSlider'

import styles from './gradient-input.module.scss';
import { HexColorPicker } from 'react-colorful';
import { GradientContextProvider } from 'context/GradientContext';

type Props = {
    sliderSettings?: GradientSetting
    onChange: (grads: { [id: string]: GradientPosition }) => void

}

function GradientInput({ sliderSettings = INITIAL_GRADIENT, onChange = () => { } }: Props)
{
    const [settings, setSettings] = useState(sliderSettings);

    const [color, setColor] = useState("#FFFFFF");

    const onColourChange = (id: string, percentage: number, colour: string) =>
    {
        setSettings(prev =>
        {

            let temp = prev.gradients;

            temp[id] = {
                colour: colour,
                percentage: percentage,
                uuid: id
            }

            onChange(temp)

            return {
                ...prev,
                gradients: temp
            }
        })
    }

    return (
        <div className={styles["input-gradient"]}>
            <div className={styles["input-gradient__slider"]}>
                <GradientContextProvider grads={settings.gradients}>
                    <GradientSlider
                        colour={color}
                        settings={settings}
                        clickCallback={onColourChange}
                        dragCallback={onColourChange}
                    />
                </GradientContextProvider>
            </div>
            <div className={styles["input-gradient__controls"]}>
                <HexColorPicker
                    color={color}
                    onChange={(col) => { setColor(col) }}
                />
            </div>
        </div>
    )
}

export default GradientInput