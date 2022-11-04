import Pack, { PackPrompts } from "../models/Pack";

import { v4 as uuid } from 'uuid';

export let pack: Pack;


export function create(): Pack
{
    return {
        settings: {
            uuid: uuid(),
            name: "Pack",
            description: "Default description"
        },
        prompts: []
    }
}

