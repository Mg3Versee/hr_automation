import { createSlice } from "@reduxjs/toolkit";
import type { AuthResponse, APIError } from "@/services/interfaces/Interfaces";
import { signinThunk, registerThunk } from "../thunk/thunk";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// ✅ Load user & token from localStorage (for "Remember Me")
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
if (storedUser && storedToken) {
  initialState.user = JSON.parse(storedUser);
  initialState.token = storedToken;
  initialState.isAuthenticated = true;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Signin
    builder
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });

    // ✅ Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
