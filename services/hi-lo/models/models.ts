import { User } from "utils/UserUtil";

export default interface HiLoGameState
{
    settings: {
        gameID: string,
        joinCode: string
        ownerID: string,
        type: "DICE" | "CARD",
        started: boolean
    },
    gameplay: {
        currentNumber: number,
        rounds: {
            currentRound: number,
            maxRounds: number,
        },
        players: {
            current: string,
            next: string,
            players: HigherLowerPlayer[]
        }
    }

}


export type HigherLowerPlayer = User & {
    streak: number
    highestStreak: number
}

export type NextTurnUpdate = {
    player: string,
    currentNumber: number,
    streak: number
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