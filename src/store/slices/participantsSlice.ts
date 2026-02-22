import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    PayloadAction,
} from '@reduxjs/toolkit';
import { Participant, RegistrationFormData } from '../../types';
import * as storage from '../../services/storage';
import { RootState } from '../index';
import toast from 'react-hot-toast';

// Використовуємо Entity Adapter для нормалізації даних
const participantsAdapter = createEntityAdapter<Participant>();

interface ParticipantsState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentEventId: string | null;
}

const initialState = participantsAdapter.getInitialState<ParticipantsState>({
    status: 'idle',
    error: null,
    currentEventId: null,
});

// Thunk для завантаження учасників
export const fetchParticipants = createAsyncThunk(
    'participants/fetchParticipants',
    async (eventId: string, { rejectWithValue }) => {
        try {
            // Симулюємо затримку
            await new Promise((resolve) => setTimeout(resolve, 600));
            return { eventId, data: storage.getParticipants(eventId) };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch participants');
        }
    }
);

// Thunk для реєстрації
export const registerNewParticipant = createAsyncThunk(
    'participants/register',
    async (
        { eventId, data }: { eventId: string; data: RegistrationFormData },
        { rejectWithValue }
    ) => {
        try {
            const result = storage.registerParticipant(eventId, data);
            toast.success('Реєстрація успішна!');
            return { eventId, participant: result };
        } catch (error: any) {
            toast.error(error.message || 'Помилка реєстрації');
            return rejectWithValue(error.message);
        }
    }
);

// Thunk для імпорту з зовнішнього API
export const importExternalParticipants = createAsyncThunk(
    'participants/import',
    async (eventId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
            const users = await response.json();

            const imported = users.map((u: any) => ({
                id: `ext-${Date.now()}-${u.id}`,
                fullName: u.name,
                email: u.email,
                birthDate: '1990-01-01',
                source: 'Found myself' as const,
                registrationDate: new Date().toISOString().split('T')[0]
            }));

            // Зберігаємо в localStorage через сервіс
            storage.saveImportedParticipants(eventId, imported);

            return { eventId, participants: imported };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk для видалення
export const removeParticipant = createAsyncThunk(
    'participants/remove',
    async ({ eventId, participantId }: { eventId: string; participantId: string }, { rejectWithValue }) => {
        try {
            storage.deleteParticipant(eventId, participantId);
            return { participantId };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const participantsSlice = createSlice({
    name: 'participants',
    initialState,
    reducers: {
        clearParticipants: (state) => {
            participantsAdapter.removeAll(state);
            state.currentEventId = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchParticipants.pending, (state, action) => {
                state.status = 'loading';
                state.currentEventId = action.meta.arg;
            })
            .addCase(fetchParticipants.fulfilled, (state, action) => {
                state.status = 'succeeded';
                participantsAdapter.setAll(state, action.payload.data);
            })
            .addCase(fetchParticipants.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerNewParticipant.fulfilled, (state, action) => {
                if (state.currentEventId === action.payload.eventId) {
                    participantsAdapter.addOne(state, action.payload.participant);
                }
            })
            .addCase(importExternalParticipants.fulfilled, (state, action) => {
                if (state.currentEventId === action.payload.eventId) {
                    participantsAdapter.addMany(state, action.payload.participants);
                }
            })
            .addCase(removeParticipant.fulfilled, (state, action) => {
                participantsAdapter.removeOne(state, action.payload.participantId);
                toast.success('Учасника видалено');
            });
    },
});

export const { clearParticipants } = participantsSlice.actions;

// Селектори
export const {
    selectAll: selectAllParticipants,
    selectById: selectParticipantById,
} = participantsAdapter.getSelectors((state: RootState) => state.participants);

// Складний селектор для фільтрації (динамічна фільтрація на рівні Redux)
export const selectFilteredParticipants = createSelector(
    [selectAllParticipants, (_state: RootState, searchQuery: string) => searchQuery],
    (participants, searchQuery) => {
        if (!searchQuery) return participants;
        const query = searchQuery.toLowerCase();
        return participants.filter(
            (p) =>
                p.fullName.toLowerCase().includes(query) ||
                p.email.toLowerCase().includes(query)
        );
    }
);

export default participantsSlice.reducer;
