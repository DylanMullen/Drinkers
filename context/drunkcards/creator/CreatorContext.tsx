import { PirateCardScheme } from "components/pirate/game/card/PirateCard"
import React, { PropsWithChildren, useState } from "react"


type PromptType = {

    settings: {
        uuid: string,
        title: string,
        description: string,
    }
    scheme?: PirateCardScheme

}

type Context = {
    addCurrentPrompt: () => void,
    removePrompt: (uuid: string) => void,
    updateCurrent: (prompt: PromptType) => void
    currentPrompt: PromptType
    prompts: { [id: string]: PromptType }
}

const intitial: Context = {
    addCurrentPrompt: () => { },
    removePrompt: () => { },
    updateCurrent: () => { },
    currentPrompt: {
        settings: {
            uuid: "",
            title: "Title",
            description: "Description"
        }
    },
    prompts: {}

}

const CreatorContext = React.createContext<Context>(intitial)

export default function useCreatorContext()
{
    return React.useContext(CreatorContext)
}

export function CreatorContextProvider({ children }: PropsWithChildren)
{
    const [value, setValue] = useState<Context>(intitial);
    const [current, setCurrent] = useState<PromptType>({
        settings: {
            uuid: "",
            title: "Title",
            description: "Description"
        }
    });


    const removePrompt = (uuid: string) =>
    {
        let temp = value.prompts;
        delete temp[uuid]

        setValue(prev => { return { ...prev, prompts: temp } })
    }

    const addPrompt = (prompt: PromptType) =>
    {
        setValue(prev =>
        {
            let temp = prev.prompts;
            temp[prompt.settings.uuid] = prompt;


            return {
                ...prev,
                prompts: temp
            }

        })
    }

    const addCurrentPrompt = () => addPrompt(current)


    return (
        <CreatorContext.Provider value={{
            addCurrentPrompt: addCurrentPrompt,
            removePrompt: removePrompt,
            updateCurrent: setCurrent,
            currentPrompt: current,
            prompts: value.prompts
        }}>
            {children}
        </CreatorContext.Provider>
    )
}