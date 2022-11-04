export default interface Pack
{
    settings: PackSettings,
    prompts: PackPrompts[]
}

export interface PackSettings
{
    uuid: string
    name: string
    description: string
}

export interface PackPrompts
{
    uuid: string
    title: string
    description: string
}