import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import eventsReducer from './slices/eventsSlice';
import participantsReducer from './slices/participantsSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        events: eventsReducer,
        participants: participantsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
