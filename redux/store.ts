import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import hiloSlice from '../services/hi-lo/redux/slice';
import pirateSlice from './pirate/slice';
import waterfallSlice from './waterfall/slice';

const store = configureStore({
    reducer: {
        waterfall: waterfallSlice,
        pirate: pirateSlice,
        hilo: hiloSlice
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;