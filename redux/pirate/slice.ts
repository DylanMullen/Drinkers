import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import store, { RootState } from "redux/store";
import { User } from "utils/UserUtil";
import PirateState, { NextPlayerTurn, PiratePlayer, PiratePrompt } from "./types";

//(Math.random() * (x % 2 === 0 ? -1 : 1)) * 7

const initialState: PirateState = {
    settings: {
        uuid: "",
        ownerID: "",
        joinCode: "",
        maxPlayers: 0,
        hasStarted: false
    },
    game: {
        prompts: {},
        players: {
            current: "",
            next: "",
            users: {}
        },
        mechanics: {}
    }
}

export const pirateSlice = createSlice({
    name: "pirate",
    initialState,
    reducers: {
        intial: (state, action: PayloadAction<PirateState>) =>
        {
            return { ...action.payload }
        },
        newPlayer: (state, action: PayloadAction<User>) =>
        {
            state.game.players.users[Object.keys(state.game.players.users).length] = action.payload
        },
        removePlayer: (state, action: PayloadAction<string>) =>
        {
            let index = -1
            for (let id = 0; id < Object.keys(state.game.players.users).length; id++)
            {
                let player = state.game.players.users[id];
                if (player.uuid !== action.payload) continue;
                index = id;
                break;
            }
            delete state.game.players.users[index]
        },
        newPrompt: (state, action: PayloadAction<PiratePrompt>) =>
        {
            let keys = Object.keys(state.game.prompts);

            delete state.game.prompts[keys[0]]
            state.game.prompts[action.payload.uuid] = action.payload
        },
        nextPlayer: (state, action: PayloadAction<NextPlayerTurn>) =>
        {
            state.game.players.current = action.payload.current
            state.game.players.next = action.payload.next
        }
    }
})

export const {
    intial, newPlayer, removePlayer, newPrompt, nextPlayer

} = pirateSlice.actions

export const selectGame = (state: RootState) => state.pirate.game;
export const selectSettings = (state: RootState) => state.pirate.settings;

export const selectPrompts = (state: RootState) => state.pirate.game.prompts;
export const selectMechanics = (state: RootState) => state.pirate.game.mechanics

export const selectPlayers = (state: RootState) => state.pirate.game.players;
export const selectCurrentPlayer = (state: RootState) => state.pirate.game.players.current;
export const selectNextPlayer = (state: RootState) => state.pirate.game.players.next;
export const selectAllPlayers = (state: RootState) => state.pirate.game.players.users;

export function hasPlayer(uuid: string): boolean
{
    let users = store.getState().pirate.game.players.users;

    for (let index = 0; index < Object.keys(users).length; index++)
        if (users[index].uuid === uuid) return true;

    return false;
}

export function getPlayer(uuid: string): PiratePlayer | undefined
{
    let users = store.getState().pirate.game.players.users;

    for (let index = 0; index < Object.keys(users).length; index++)
        if (users[index].uuid === uuid) return users[index];

    return undefined;
}

export function getFirstPrompt(): string
{
    return Object.keys(store.getState().pirate.game.prompts)[0] ?? undefined
}


export default pirateSlice.reducer