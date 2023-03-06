import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store, { RootState } from "redux/store";
import HiLoGameState from "../models/models";
import HiLoGame, { HigherLowerPlayer, NextTurnUpdate, PlayerPositionUpdate } from "../models/models";


const initialState: HiLoGameState = {
    settings: {
        gameID: "",
        ownerID: "",
        joinCode: "",
        type: "CARD",
        started: false,
    },
    gameplay: {
        currentNumber: -1,
        players: {
            current: "",
            next: "",
            players: []
        },
        rounds: {
            currentRound: 0,
            maxRounds: -1,
        },
        controls: {
            canShowButtons: true,
            wasWinner: false,
            flipCard: false
        }
    }
}

export const hiloSlice = createSlice({
    name: "higher-lower",
    initialState,
    reducers: {
        init: (state, action: PayloadAction<HiLoGame>) =>
        {
            return {
                ...action.payload,
                gameplay: {
                    ...action.payload.gameplay,
                    rounds: {
                        ...action.payload.gameplay.rounds,
                    },
                    controls: {
                        ...state.gameplay.controls
                    }
                }
            }
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
        nextTurn: (state, { payload: { number, current, next, winner, streak } }: PayloadAction<NextTurnUpdate>) =>
        {
            state.gameplay.currentNumber = number;
            state.gameplay.players.current = current;
            state.gameplay.players.next = next;
            state.gameplay.controls.wasWinner = winner
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
        },
        updateWinner: (state, action: PayloadAction<boolean>) =>
        {
            state.gameplay.controls.wasWinner = action.payload
        },
        updateShowButtons: (state, action: PayloadAction<boolean>) =>
        {
            state.gameplay.controls.canShowButtons = action.payload
        },
        updateCard: (state, action: PayloadAction<boolean>) =>
        {
            state.gameplay.controls.flipCard = action.payload
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
    updateOwner: hiloSlice.actions.updateOwner,
    updateWinner: hiloSlice.actions.updateWinner,
    updateButtons: hiloSlice.actions.updateShowButtons,
    updateCard: hiloSlice.actions.updateCard
}

export const HiLoSelectors = {
    settings: (state: RootState) => state.hilo.settings,
    game: (state: RootState) => state.hilo.gameplay,
    users: (state: RootState) => state.hilo.gameplay.players.players,
    currentUser: (state: RootState) => state.hilo.gameplay.players.current,
    nextUser: (state: RootState) => state.hilo.gameplay.players.next,
    currentNumber: (state: RootState) => state.hilo.gameplay.currentNumber,
    rounds: (state: RootState) => state.hilo.gameplay.rounds,
    wasWinner: (state: RootState) => state.hilo.gameplay.controls.wasWinner,
    canShowButtons: (state: RootState) => state.hilo.gameplay.controls.canShowButtons,
    shouldFlip: (state: RootState) => state.hilo.gameplay.controls.flipCard,
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