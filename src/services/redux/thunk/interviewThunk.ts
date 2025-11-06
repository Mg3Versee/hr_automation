import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getInterviewResults,
  getInterviewStats,
  postInterviewFeedback,
  exportInterviewResultsCsv,
} from "@/services/api/interviewResultsAPI";
import { InterviewFeedback } from "@/services/interfaces/interview.interface";

/** Load results list */
export const fetchInterviewResults = createAsyncThunk(
  "interview/fetchResults",
  async (params: { job_id?: number; candidate_id?: number; page?: number; page_size?: number }, { rejectWithValue }) => {
    try {
      return await getInterviewResults(params);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "Failed to load interview results");
    }
  }
);

/** Load stats (header widgets) */
export const fetchInterviewStats = createAsyncThunk(
  "interview/fetchStats",
  async (params: { job_id?: number } | undefined, { rejectWithValue }) => {
    try {
      return await getInterviewStats(params);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "Failed to load interview stats");
    }
  }
);

/** Save feedback for a result */
export const submitInterviewFeedback = createAsyncThunk(
  "interview/submitFeedback",
  async (payload: { result_id: number; feedback: InterviewFeedback }, { rejectWithValue }) => {
    try {
      return await postInterviewFeedback(payload);
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "Failed to submit feedback");
    }
  }
);

/** Export CSV and hand the Blob back to the component */
export const exportInterviewCsv = createAsyncThunk(
  "interview/exportCsv",
  async (params: { job_id?: number } | undefined, { rejectWithValue }) => {
    try {
      const blob = await exportInterviewResultsCsv(params);
      return blob as Blob;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "Failed to export results");
    }
  }
);
