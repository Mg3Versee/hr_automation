/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { schedulerFetchCandidates, schedulerScheduleInterview } from "../thunk/schedulerThunk";
import type { RawCandidate, ScheduleResponse } from "@/services/api/schedulerAPI";

export type SchedulerState = {
  candidates: RawCandidate[];
  loading: boolean;
  error: string | null;
  lastFetchedAt?: number;

  // Result of schedule action (for toasts / UI)
  schedule: {
    pending: boolean;
    result: ScheduleResponse | null;
    error: string | null;
  };
};

const initialState: SchedulerState = {
  candidates: [],
  loading: false,
  error: null,
  lastFetchedAt: undefined,
  schedule: { pending: false, result: null, error: null },
};

const schedulerSlice = createSlice({
  name: "scheduler",
  initialState,
  reducers: {
    clearScheduleResult(state) {
      state.schedule.result = null;
      state.schedule.error = null;
      state.schedule.pending = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch candidates
    builder
      .addCase(schedulerFetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(schedulerFetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload ?? [];
        state.lastFetchedAt = Date.now();
      })
      .addCase(schedulerFetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load candidates";
      });

    // Schedule interview
    builder
      .addCase(schedulerScheduleInterview.pending, (state) => {
        state.schedule.pending = true;
        state.schedule.error = null;
        state.schedule.result = null;
      })
      .addCase(schedulerScheduleInterview.fulfilled, (state, action) => {
        state.schedule.pending = false;
        state.schedule.result = action.payload;
      })
      .addCase(schedulerScheduleInterview.rejected, (state, action) => {
        state.schedule.pending = false;
        state.schedule.error = (action.payload as string) || "Failed to schedule interview";
      });
  },
});

export const { clearScheduleResult } = schedulerSlice.actions;
export default schedulerSlice.reducer;

/* Selectors */
export const selectSchedulerCandidates = (s: any) => (s.scheduler as SchedulerState).candidates;
export const selectSchedulerLoading = (s: any) => (s.scheduler as SchedulerState).loading;
export const selectSchedulerError = (s: any) => (s.scheduler as SchedulerState).error;
export const selectSchedulerLastFetchedAt = (s: any) => (s.scheduler as SchedulerState).lastFetchedAt;

export const selectSchedulePending = (s: any) => (s.scheduler as SchedulerState).schedule.pending;
export const selectScheduleResult = (s: any) => (s.scheduler as SchedulerState).schedule.result;
export const selectScheduleError = (s: any) => (s.scheduler as SchedulerState).schedule.error;
