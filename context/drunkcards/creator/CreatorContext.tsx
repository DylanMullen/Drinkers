import { PirateCardScheme } from "components/pirate/game/card/PirateCard"
import React, { PropsWithChildren, useEffect, useState } from "react"
import { init } from "services/cookies/CookieManager";
import { v4 as uuid } from 'uuid';


export type PromptType = {

    settings: {
        uuid: string,
        title: string,
        description: string,
    }
    scheme?: PirateCardScheme
    isDefault: boolean
}

export type PackType = {
    packName: string,
    packDesc: string,
}

type Context = LocalContextStore & {
    updatePackSettings: (settings: PackType) => void,
    updateDefaultScheme: (scheme: PirateCardScheme) => void,
    clearPack: () => void

    addCurrentPrompt: () => void,
    removePrompt: (uuid: string) => void,
    updateCurrent: (prompt: PromptType) => void
    resetCurrent: () => void
}

type LocalContextStore = {
    packSettings: PackType
    defaultScheme: PirateCardScheme

    currentPrompt: PromptType
    prompts: { [id: string]: PromptType }
}

const intitial: Context = {
    updatePackSettings: () => { },
    updateDefaultScheme: () => { },
    clearPack: () => { },

    addCurrentPrompt: () => { },
    removePrompt: () => { },
    updateCurrent: () => { },
    resetCurrent: () => { },

    packSettings: {
        packName: "Default Pack",
        packDesc: "Default Pack Description. Change me please."
    },
    currentPrompt: {
        settings: {
            uuid: "",
            title: "Title",
            description: "Description"
        },
        isDefault: true
    },
    prompts: {},
    defaultScheme: {
        background: "white",
        text: "black",
        shadow: "rgba(0, 0, 0, 0.75)"
    }

}

const initialPrompt: PromptType = {
    settings: {
        uuid: "",
        title: "Title",
        description: "Description"
    },
    isDefault: true
}

const CreatorContext = React.createContext<Context>(intitial)

export default function useCreatorContext()
{
    return React.useContext(CreatorContext)
}


function getLocal()
{
    return localStorage.getItem("drunkCreator");
}

export function CreatorContextProvider({ children }: PropsWithChildren)
{
    const [value, setValue] = useState<Context>(intitial);
    const [current, setCurrent] = useState<PromptType>({ ...initialPrompt, settings: { ...initialPrompt.settings, uuid: uuid() } });


    const removePrompt = (uuid: string) =>
    {
        let temp = value.prompts;
        delete temp[uuid]

        setValue(prev =>
        {
            saveToLocal({
                ...value,
                prompts: temp
            })
            return { ...prev, prompts: temp }
        })
    }

    const addPrompt = (prompt: PromptType) =>
    {
        setValue(prev =>
        {
            let temp = prev.prompts;
            temp[prompt.settings.uuid] = prompt;

            saveToLocal({
                ...value,
                prompts: temp
            })

            return {
                ...prev,
                prompts: temp
            }
        })

    }

    const updatePackSettings = (pack: PackType) =>
    {
        setValue(prev =>
        {
            saveToLocal({
                ...value,
                packSettings: pack
            })
            return {
                ...prev,
                packSettings: pack
            }
        })
    }

    const updateDefaultScheme = (scheme: PirateCardScheme) =>
    {
        setValue(prev =>
        {
            saveToLocal({
                ...value,
                defaultScheme: scheme
            })
            return {
                ...prev,
                defaultScheme: scheme
            }
        })
    }

    const resetCurrentPrompt = () => setCurrent({ ...initialPrompt, settings: { ...initialPrompt.settings, uuid: uuid() } })
    const clearPack = () => setValue(prev =>
    {
        saveToLocal({
            ...value,
            prompts: {}
        })
        return { ...prev, prompts: {} }
    })

    const addCurrentPrompt = () =>
    {
        addPrompt(current)
        resetCurrentPrompt()
    }

    useEffect(() =>
    {
        if (getLocal() === undefined) return;
        let val = JSON.parse(getLocal() as string);
        setValue(prev =>
        {
            return {
                ...prev,
                ...val
            }
        })

    }, [])

    return (
        <CreatorContext.Provider value={{
            updatePackSettings: updatePackSettings,
            updateDefaultScheme: updateDefaultScheme,
            addCurrentPrompt: addCurrentPrompt,
            removePrompt: removePrompt,
            updateCurrent: setCurrent,
            resetCurrent: resetCurrentPrompt,
            clearPack: clearPack,
            packSettings: value.packSettings,
            currentPrompt: current,
            prompts: value.prompts,
            defaultScheme: value.defaultScheme
        }}>
            {children}
        </CreatorContext.Provider>
    )
}

function saveToLocal(prompts: LocalContextStore)
{
    localStorage.setItem("drunkCreator", JSON.stringify(prompts))
}
