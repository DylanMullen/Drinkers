export default interface Pack
{
    settings: PackSettings,
    prompts: PackPrompt[]
}

export interface PackSettings
{
    uuid: string
    name: string
    description: string
}

export interface PackPrompt
{
    uuid: string
    title: string
    description: string
    rotation: number
}