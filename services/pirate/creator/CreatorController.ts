import Pack, { PackPrompt } from "../models/Pack";

import { v4 as uuid } from 'uuid';
import { PackType, PromptType } from "context/drunkcards/creator/CreatorContext";
import { PirateCardScheme } from "components/pirate/game/card/PirateCard";


export function createPack(packSettings:PackType, promptTypes: { [id: string]: PromptType }, defaultScheme: PirateCardScheme): Pack
{
    let prompts: PackPrompt[] = Object.keys(promptTypes).map(e =>
    {
        let { settings, scheme } = promptTypes[e];
        return {
            uuid: settings.uuid,
            title: settings.title,
            description: settings.description,
            scheme: scheme ?? defaultScheme,
        }
    })

    return {
        settings: {
            uuid: uuid(),
            name: packSettings.packName,
            description: packSettings.packDesc
        },
        prompts: prompts
    }
}

export function savePack(pack: Pack)
{
    const json = JSON.stringify(pack, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = `${pack.settings.name}-pack.json`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}