/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCandidatesAPI,
  scheduleInterviewAPI,
  type RawCandidate,
  type ScheduleResponse,
} from "@/services/api/schedulerAPI";

/** Load candidates (optionally by job_id) */
export const schedulerFetchCandidates = createAsyncThunk<
  RawCandidate[],
  number | string | undefined,
  { rejectValue: string }
>("scheduler/fetchCandidates", async (jobId, { rejectWithValue }) => {
  try {
    return await fetchCandidatesAPI(jobId);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to load candidates");
  }
});

/** Schedule interview for a candidate */
export const schedulerScheduleInterview = createAsyncThunk<
  ScheduleResponse,
  {
    candidate_id: number | string;
    email: string;
    date_iso: string;
    time_slot: string;
    job_description?: string | null;
  },
  { rejectValue: string }
>("scheduler/scheduleInterview", async (payload, { rejectWithValue }) => {
  try {
    return await scheduleInterviewAPI(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to schedule interview");
  }
});
