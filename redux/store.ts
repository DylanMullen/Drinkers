import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import pirateSlice from './pirate/slice';
import waterfallSlice from './waterfall/slice';

const store = configureStore({
    reducer: {
        waterfall: waterfallSlice,
        pirate: pirateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;