import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slice/authSlice"; 
import assessmentReducer from "@/services/redux/slice/assessmentSlice";
import dashboardReducer from "../redux/slice/dashboardSlice";
import candidateReducer from "@/services/redux/slice/candidateSlice";
import interviewReducer from "@/services/redux/slice/interviewSlice";

// Simple placeholder reducers for areas you haven't built yet
const createPlaceholderReducer =
  (_name: string) =>
  (state = {}, _action: any) =>
    state;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    assessment: assessmentReducer,
    candidate: candidateReducer,
    pipeline: createPlaceholderReducer("pipeline"),
    interview: interviewReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
