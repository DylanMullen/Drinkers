export default interface WaterfallState
{
    lobby?: WaterfallLobby
    game: WaterfallGame,
    card: WaterfallCard
}

export interface WaterfallLobby
{
    readyPlayers: string[]
}

export interface WaterfallGame
{
    gameId: string,
    gameName: string,
    joinCode: string,
    ownerId: string,
    started: boolean,
    kicked: boolean,
    modal?: WaterfallModal
    action?: WaterfallAction,
    players: {
        current: string,
        next: string,
        max?: number,
        users: {
            [id: number]: WaterfallPlayer
        }
    },
    mechanics: {
        hiddenBack: boolean,
        thumbMaster?: string,
        actions?: boolean,
        rules: {
            [id: number]: WaterfallRule
        }
        dates: {
            [id: number]: WaterfallDate
        }
    }
}

export interface WaterfallPlayer
{
    uuid: string,
    username: string,
    avatar: string,
    offline?: boolean
}

export interface WaterfallRule
{
    uuid: string,
    rule: string,
    creator: string
}

export interface WaterfallDate
{
    owner: string,
    date: string
}

export interface WaterfallCard
{
    creatorUUID: string,
    face: number,
    suite: number,
    details: WaterfallCardDetails,
    cardsLeft?: number
    finished?: boolean
    nextTurn?: boolean
}

export interface WaterfallCardDetails
{
    title: string,
    description: string,
    action?: WaterfallAction | undefined
}

export interface WaterfallModal
{
    id: number,
    show?: boolean,
    content: any
}

export interface WaterfallAction
{
    id: number,
    content?: any
}

/* Payloads */

export interface PayloadNextUser
{
    current: string,
    next: string
}