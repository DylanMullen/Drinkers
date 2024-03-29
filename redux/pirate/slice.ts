import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import store, { RootState } from "redux/store";
import { User } from "utils/UserUtil";
import PirateState, { NextPlayerTurn, PiratePlayer, PiratePrompt, PlayerJoined } from "./types";


const initialState: PirateState = {
    settings: {
        uuid: "",
        ownerID: "",
        joinCode: "",
        maxPlayers: 0,
        hasStarted: false
    },
    game: {
        prompts: {
        },
        turns: 0,
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
            for (const key in action.payload.game.prompts)
            {
                const element = action.payload.game.prompts[key];
                element.rotation = (Math.random()) * 5
            }


            return { ...action.payload }
        },
        reset: () =>
        {
            return initialState
        },
        newPlayer: (state, action: PayloadAction<PlayerJoined>) =>
        {
            state.game.players.users[Object.keys(state.game.players.users).length] = action.payload.player
            state.game.players.current = action.payload.current
            state.game.players.next = action.payload.next
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
        newPrompt: (state, action: PayloadAction<{ prompt: PiratePrompt, turns:number }>) =>
        {
            let { prompt, turns } = action.payload;

            prompt.rotation = Math.random() * 7;
            // state.game.turns = turns
            state.game.prompts[prompt.uuid] = prompt

        },
        deleteFirstPrompt: (state) =>
        {
            let keys = Object.keys(state.game.prompts);

            delete state.game.prompts[keys[0]]

        },
        nextPlayer: (state, action: PayloadAction<NextPlayerTurn>) =>
        {
            state.game.players.current = action.payload.current
            state.game.players.next = action.payload.next
        },
        increaseTurns: (state) =>
        {
            state.game.turns = state.game.turns + 1
        }
    }
})

export const {
    intial, newPlayer, removePlayer, newPrompt, nextPlayer, deleteFirstPrompt, reset, increaseTurns

} = pirateSlice.actions

export const selectGame = (state: RootState) => state.pirate.game;
export const selectSettings = (state: RootState) => state.pirate.settings;

export const selectPrompts = (state: RootState) => state.pirate.game.prompts;
export const selectTurns = (state: RootState) => state.pirate.game.turns
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