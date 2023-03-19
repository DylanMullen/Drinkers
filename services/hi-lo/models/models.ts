import { CardStyle } from "components/shared/playing-card/PlayingCard";
import { User } from "utils/UserUtil";

export default interface HiLoGameState
{
    settings: {
        gameID: string,
        joinCode: string
        ownerID: string,
        type: "DICE" | "CARD",
        started: boolean,
    },
    gameplay: {
        currentNumber: number,
        suite: number,
        rounds: {
            currentRound: number,
            maxRounds: number,
        },
        players: {
            current: string,
            next: string,
            players: HigherLowerPlayer[]
        },
        prompt?: Prompt,
        controls: {
            canShowButtons: boolean,
            wasWinner: boolean,
            flipCard: boolean
        }
    },
    theme: Theme
}

export type Theme = {
    table: string,
    red: CardStyle,
    black: CardStyle
}


export type HigherLowerPlayer = User & {
    streak: number
    highestStreak: number,
    owner?: string
}

export type NextTurnUpdate = {
    current: string,
    number: number,
    streak: number,
    winner: boolean,
    next: string
}

export type NewPlayer = PlayerPositionUpdate & {
    player: HigherLowerPlayer,
}

export type PlayerPositionUpdate = {
    current: string,
    next: string
}

export type CreateRequest = {
    owner: HigherLowerPlayer,
    type: "DICE" | "CARD",
    maxRounds?: number,
    debug?: boolean
}

export type JoinRequest = {
    joinCode: string,
    player: HigherLowerPlayer
}

export type Prompt = {
    owner: string,
    title: string,
    description: string,
    time?: number
}