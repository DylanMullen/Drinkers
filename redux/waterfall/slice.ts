import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "redux/store";
import store from "redux/store";
import type WaterfallState from "./types";
import { PayloadNextUser, WaterfallCard, WaterfallDate, WaterfallGame, WaterfallModal, WaterfallPlayer, WaterfallRule } from "./types";

const initialState: WaterfallState = {
    lobby: {
        readyPlayers: []
    },
    game: {
        gameId: "",
        ownerId: "",
        gameName: "",
        joinCode: "",
        started: false,
        kicked: false,
        players: {
            current: "",
            next: "",
            users: {}
        },
        mechanics: {
            hiddenBack: false,
            thumbMaster: "",
            dates: {},
            rules: []
        }
    },
    card: {
        creatorUUID: "76deb40e-f18e-47f8-aaae-adb0f9f353a1",
        face: 2,
        suite: 3,
        details: {
            title: "Waterfall",
            description: "Everyone must drink until you stop drinking"
        }
    }
}

export const waterfallSlice = createSlice({
    name: "waterfall",
    initialState,
    reducers: {
        lobby: (state) =>
        {
            return {
                ...initialState,
                lobby: {
                    readyPlayers: []
                },
                game: {
                    ...state.game,
                    started: false,
                    mechanics: {
                        ...initialState.game.mechanics
                    }
                },
            };
        },
        ready: (state, action: PayloadAction<string>) =>
        {
            if (!state.lobby)
                return;

            state.lobby.readyPlayers = [...state.lobby?.readyPlayers, action.payload]
        },
        start: (state) =>
        {
            state.lobby = undefined
            state.game.started = true
        },
        join: (state, action: PayloadAction<WaterfallState>) =>
        {
            return {
                ...state,
                ...action.payload,
                game: {
                    ...state.game,
                    ...action.payload.game,
                },
            };
        },
        leave: (state) =>
        {
            state = initialState
        },
        kicked: (state) =>
        {
            state.game.kicked = true;
        },
        newPlayer: (state, action: PayloadAction<WaterfallPlayer>) =>
        {
            state.game.players.users = {
                ...state.game.players.users,
                [Object.keys(state.game.players.users).length]: action.payload
            }
        },
        removePlayer: (state, action: PayloadAction<number>) =>
        {
            let user = state.game.players.users[action.payload]

            for (const key in state.game.mechanics.dates)
            {
                let date = state.game.mechanics.dates[key]
                if (date.date === user.uuid || date.owner === user.uuid)
                    delete state.game.mechanics.dates[key]
            }

            delete state.game.players.users[action.payload];

        },
        nextPlayer: (state, action: PayloadAction<PayloadNextUser>) =>
        {
            state.game.players = {
                ...state.game.players,
                current: action.payload.current,
                next: action.payload.next,
            }
        },
        nextCard: (state, action: PayloadAction<WaterfallCard>) =>
        {
            state.card = action.payload
        },
        newDate: (state, action: PayloadAction<WaterfallDate>) =>
        {
            state.game.mechanics.dates = {
                ...state.game.mechanics.dates,
                [Object.keys(state.game.mechanics.dates).length]: action.payload
            }
        },
        newRule: (state, action: PayloadAction<WaterfallRule>) =>
        {
            state.game.mechanics.rules = {
                ...state.game.mechanics.rules,
                [Object.keys(state.game.mechanics.rules).length]: action.payload
            }
        },
        removeRule: (state, action: PayloadAction<number>) =>
        {
            delete state.game.mechanics.rules[action.payload];
        },
        updateModal: (state, action: PayloadAction<WaterfallModal | undefined>) =>
        {
            state.game.modal = action.payload
        }, openModal: (state) =>
        {
            if (state.game.modal)
                state.game.modal.show = true;
        },
        updateNextTurnButton: (state) =>
        {
            state.card.nextTurn = true
        },
        thumbMaster: (state, action: PayloadAction<string>) =>
        {
            state.game.mechanics.thumbMaster = action.payload
        }, updateSetting: (state, action: PayloadAction<{ setting: string, value: any }>) =>
        {
            switch (action.payload.setting)
            {
                case "maxPlayer": {
                    state.game.players.max = action.payload.value
                    return;
                }
                case "enableActions": {
                    state.game.mechanics.actions = action.payload.value
                    return;
                }
                case "hiddenBack": {
                    state.game.mechanics.hiddenBack = action.payload.value
                    return;
                }

            }
        }
    }
})

export const
    {
        lobby, ready, start,
        join, leave, newPlayer,
        removePlayer, nextPlayer,
        nextCard, newDate, newRule,
        removeRule, updateModal, openModal,
        thumbMaster, updateNextTurnButton, kicked,
        updateSetting
    } = waterfallSlice.actions;

export const selectLobby = (state: RootState) => state.waterfall.lobby
export const selectGame = (state: RootState) => state.waterfall.game;
export const selectCard = (state: RootState) => state.waterfall.card;

export const selectGameName = (state: RootState) => state.waterfall.game.gameName
export const selectStarted = (state: RootState) => state.waterfall.game.started
export const selectKicked = (state: RootState) => state.waterfall.game.kicked

export const selectPlayers = (state: RootState) => state.waterfall.game.players;
export const selectMechanics = (state: RootState) => state.waterfall.game.mechanics;
export const selectCardDetails = (state: RootState) => state.waterfall.card.details;

export const selectHiddenBack = (state: RootState) => state.waterfall.game.mechanics.hiddenBack
export const selectRules = (state: RootState) => state.waterfall.game.mechanics.rules

export const selectModal = (state: RootState) => state.waterfall.game.modal

export const selectCurrentPlayer = (state: RootState) => state.waterfall.game.players.current
export const selectNextPlayer = (state: RootState) => state.waterfall.game.players.next

export function isReady(uuid: string)
{
    return store.getState().waterfall.lobby?.readyPlayers.find(e => e === uuid) !== undefined
}

export function getWaterfallPlayerByUUID(uuid: string)
{
    let players = store.getState().waterfall.game.players.users;

    for (let i = 0; i < Object.keys(players).length; i++)
        if (players[i].uuid === uuid)
            return players[i]

    return undefined;
}

export function getWaterfallPlayerIndex(uuid: string)
{
    let players = store.getState().waterfall.game.players.users;
    for (let i = 0; i < Object.keys(players).length; i++)
        if (players[i].uuid === uuid)
            return i
    return undefined
}

export function getWaterfallDates(uuid: string)
{
    let dates = store.getState().waterfall.game.mechanics.dates;

    let response: WaterfallDate[] = []

    for (let x = 0; x < Object.keys(dates).length; x++)
    {
        const date = dates[x];
        if (date.date === uuid)
            response.push(date)
    }
    return response;
}

export function getWaterfallPlayers(): WaterfallPlayer[]
{
    let users = store.getState().waterfall.game.players.users;
    let response: WaterfallPlayer[] = []
    for (let x = 0; x < Object.keys(users).length; x++)
        response.push(users[x])
    return response;
}


export default waterfallSlice.reducer;