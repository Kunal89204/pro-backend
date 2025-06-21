import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface AuthState {
    user: {
        username?: string,
        fullName?: string,
        email?: string,
        avatarImage?:string,
        _id?:string

    },
    token: string,
    isAuthenticated: boolean
}

const authState: AuthState = {
    user: {},
    token: "", 
    isAuthenticated: false                  
}



export const authSlice = createSlice({
    name: 'auth',
    initialState: authState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ user: AuthState['user'], token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = {};
            state.token = "";
            state.isAuthenticated = false;
        }
    }
});


export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;