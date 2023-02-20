import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store, { RootState } from "redux/store";
import HiLoGame, { HigherLowerPlayer, NextTurnUpdate, PlayerPositionUpdate } from "../models/models";


const initialState: HiLoGame = {
    settings: {
        gameID: "",
        ownerID: "",
        type: "CARD",
        started: false,
    },
    gameplay: {
        currentNumber: 0,
        players: {
            current: "",
            next: "",
            players: []
        },
        rounds: {
            currentRound: 0,
            maxRounds: -1
        }
    }
}

export const hiloSlice = createSlice({
    name: "higher-lower",
    initialState,
    reducers: {
        init: (_, action: PayloadAction<HiLoGame>) =>
        {
            return { ...action.payload }
        },
        addPlayer: (state, action: PayloadAction<HigherLowerPlayer>) =>
        {
            state.gameplay.players.players.push(action.payload)
        },
        removePlayer: (state, action: PayloadAction<string>) =>
        {
            let index = -1;
            state.gameplay.players.players.forEach((e, i) =>
            {
                if (e.uuid === action.payload)
                    index = i;
            })

            if (index !== -1)
                delete state.gameplay.players.players[index]
        },
        nextTurn: (state, { payload: { currentNumber, player, streak } }: PayloadAction<NextTurnUpdate>) =>
        {
            state.gameplay.currentNumber = currentNumber;
            state.gameplay.players.current = player;
        },
        updatePlayerPositions: (state, { payload: { current, next } }: PayloadAction<PlayerPositionUpdate>) =>
        {
            state.gameplay.players.current = current;
            state.gameplay.players.next = next;
        },
        updateGameState: (state, action: PayloadAction<boolean>) =>
        {
            state.settings.started = action.payload
        },
        updateOwner: (state, action: PayloadAction<string>) =>
        {
            state.settings.ownerID = action.payload
        }
    }
})

// export const {
//     init, addPlayer, removePlayer, nextTurn, updatePlayerPositions, updateGameState, updateOwner
// } = hiloSlice.actions

export const HiLoActions = {
    init: hiloSlice.actions.init,
    addPlayer: hiloSlice.actions.addPlayer,
    removePlayer: hiloSlice.actions.removePlayer,
    nextTurn: hiloSlice.actions.nextTurn,
    updatePlayerPositions: hiloSlice.actions.updatePlayerPositions,
    updateGameState: hiloSlice.actions.updateGameState,
    updateOwner: hiloSlice.actions.updateOwner
}

export const HiLoSelectors = {
    settings: (state: RootState) => state.hilo.settings,
    game: (state: RootState) => state.hilo.gameplay,
    users: (state: RootState) => state.hilo.gameplay.players.players,
    currentUser: (state: RootState) => state.hilo.gameplay.players.current,
    nextUser: (state: RootState) => state.hilo.gameplay.players.next,
    currentNumber: (state: RootState) => state.hilo.gameplay.currentNumber,
    rounds: (state: RootState) => state.hilo.gameplay.rounds,

    getUser: (uuid: string) =>
    {
        return store.getState().hilo.gameplay.players.players.find(e => e.uuid === uuid)
    },
    hasUser: (uuid: string) =>
    {
        return store.getState().hilo.gameplay.players.players.find(e => e.uuid === uuid) !== undefined
    }
}

export default hiloSlice.reducer