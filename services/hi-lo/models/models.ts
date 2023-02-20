import { User } from "utils/UserUtil";

export default interface HiLoGame
{
    settings: {
        gameID: string,
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
            next:string,
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
    currentNumber:number,
    streak:number
}

export type NewPlayer = PlayerPositionUpdate &{
    player: HigherLowerPlayer,
}

export type PlayerPositionUpdate = {
    current: string,
    next:string
}