import Pack, { PackPrompt } from "../models/Pack";

import { v4 as uuid } from 'uuid';


export function createPack({ name, description }: { name: string, description: string }): Pack
{
    let pack = {
        prompts: [],
        settings: {
            uuid: uuid(),
            name: name,
            description: description
        }
    }
    return pack
}

export function addPrompt(pack:Pack, prompt: PackPrompt)
{
    pack.prompts.push(prompt)
}

export function removePrompt(pack:Pack, index: number)
{
    delete pack.prompts[index]
}

export function save(pack:Pack)
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