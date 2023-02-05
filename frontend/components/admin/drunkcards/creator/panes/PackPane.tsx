import { getGradientCSS, GradientPosition, GradientSetting } from 'components/shared/input/gradient/slider/GradientSlider'
import SwitchInput from 'components/shared/input/switch'
import TextInput from 'components/shared/input/text'
import AreaInput from 'components/shared/input/textarea'
import useCreatorContext from 'context/drunkcards/creator/CreatorContext'
import React, { useState } from 'react'

import styles from '../creator.module.scss'
import { Graphics, GraphicsBtn, GraphicsPaneSettings } from './GraphicsPane'


type Props = {}

function PackPane({ }: Props)
{
    const { updatePackSettings, updateDefaultScheme, packSettings, defaultScheme } = useCreatorContext();

    const [selected, setSelected] = useState<Graphics>(Graphics.TEXT)


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

    const switchButtons = (e: Graphics) =>
    {
        setSelected(e)
    }


    const onColourChange = (color: string) =>
    {
        switch (selected)
        {
            case Graphics.TEXT: updateDefaultScheme({ ...defaultScheme, text: color }); break;
            case Graphics.BACKGROUND: updateDefaultScheme({ ...defaultScheme, background: color }); break;
            case Graphics.SHADOW: updateDefaultScheme({ ...defaultScheme, shadow: color }); break;
        }
    }

    const onGradientChange = (grads: { [id: string]: GradientPosition }) =>
    {
        setGradient(prev =>
        {
            let temp: GradientSetting = { ...prev, gradients: grads }
            updateDefaultScheme({ ...defaultScheme, background: getGradientCSS(temp) })
            return temp
        })
    }


    const shouldUseGradient = useGradient && selected === Graphics.BACKGROUND

    return (
        <div className={styles["pack-pane"]}>
            <div className={styles["pack-pane__options"]}>
                <h2 className={styles["drunkcards-creator__subtitle"]}>Pack Settings</h2>
                <TextInput
                    label="Pack Name"
                    value={packSettings.packName}
                    retriever={(packName: string) => updatePackSettings({ ...packSettings, packName: packName })}

                />
                <AreaInput
                    label="Pack Description"
                    value={packSettings.packDesc}
                    callback={(desc: string) => updatePackSettings({ ...packSettings, packDesc: desc })}

                />
            </div>
            <div className={styles["pack-pane__color"]}>
                <h2 className={styles["drunkcards-creator__subtitle"]}>Default Styling</h2>
                <GraphicsPaneSettings
                    currentColour='#FFF'
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
        </div>
    )
}

export default PackPane