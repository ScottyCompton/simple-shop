import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

const initialState = {
    user: null as User | null,
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
    selectors: {
        selectUser: (state) => state.user,
    }
})

export const { setUser, clearUser } = userSlice.actions;
export const { selectUser } = userSlice.selectors;
