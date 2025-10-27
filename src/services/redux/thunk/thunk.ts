import { AuthResponse, LoginPayload, APIError, SignupPayload } from "@/services/interfaces/Interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signinAPI, registerAPI } from "../api";


export const signinThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: APIError }
>("auth/signin", async (payload, { rejectWithValue }) => {
  try {
    const response = await signinAPI(payload);
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue({ message: error.message });
  }
});

export const registerThunk = createAsyncThunk<
  AuthResponse,
  SignupPayload,
  { rejectValue: APIError }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await registerAPI(payload);
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue({ message: error.message });
  }
});
