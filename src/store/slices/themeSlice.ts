import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    isDarkMode: boolean;
}

const initialState: ThemeState = {
    isDarkMode: localStorage.getItem('theme') === 'dark',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        },
        setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
            state.isDarkMode = action.payload === 'dark';
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
