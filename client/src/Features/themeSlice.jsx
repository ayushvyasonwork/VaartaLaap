import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "themeSlice",
    initialState: true,
    reducers: {
        toggleTheme: (state) => {
            return !state; // Toggle the state correctly
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
