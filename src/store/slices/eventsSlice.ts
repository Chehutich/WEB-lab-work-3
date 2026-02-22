import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SwimmingEvent } from '../../types';
import * as storage from '../../services/storage';

interface EventsState {
    items: SwimmingEvent[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EventsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
    // Симулюємо затримку мережі
    await new Promise((resolve) => setTimeout(resolve, 800));
    return storage.getEvents();
});

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<SwimmingEvent[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch events';
            });
    },
});

export default eventsSlice.reducer;
