import { PirateCardScheme } from "components/pirate/game/card/PirateCard"
import { PackPrompt } from "services/pirate/models/Pack"
import { User } from "utils/UserUtil"

export default interface PirateState
{
    settings: PirateSettings,
    game: PirateGame,
}

export interface PirateSettings
{
    uuid: string,
    ownerID: string,
    joinCode: string,
    maxPlayers: number
    hasStarted: boolean,
}

export interface PirateGame
{
    prompts: {
        [id: string]: PiratePrompt
    }
    turns: number
    players: {
        current: string,
        next: string,
        users: {
            [id: number]: User
        }
    },
    mechanics: {}
}

export interface PiratePlayer
{
    uuid: string
    username: string,
    avatar: string,
    bot?: boolean
}

export interface PiratePrompt
{
    uuid: string
    title: string,
    description: string,
    scheme: PirateCardScheme,
    rotation: number
}

export interface NextPlayerTurn
{
    current: string
    next: string,
}

export interface PlayerJoined
{
    player: User,
    current: string
    next: string,
}