import { createSlice } from "@reduxjs/toolkit";
import {
  fetchInterviewResults,
  fetchInterviewStats,
  submitInterviewFeedback,
  exportInterviewCsv,
} from "../thunk/interviewThunk";
import { InterviewResult, InterviewStats } from "@/services/interfaces/interview.interface";

interface InterviewState {
  results: InterviewResult[];
  total: number;
  stats: InterviewStats | null;
  loading: boolean;
  error: string | null;
  exporting: boolean;
  lastCsv?: Blob;
}

const initialState: InterviewState = {
  results: [],
  total: 0,
  stats: null,
  loading: false,
  error: null,
  exporting: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Results
      .addCase(fetchInterviewResults.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchInterviewResults.fulfilled, (s, a) => {
        s.loading = false;
        s.results = a.payload.results;
        s.total = a.payload.total;
      })
      .addCase(fetchInterviewResults.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Stats
      .addCase(fetchInterviewStats.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchInterviewStats.fulfilled, (s, a) => {
        s.loading = false;
        s.stats = a.payload;
      })
      .addCase(fetchInterviewStats.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Feedback
      .addCase(submitInterviewFeedback.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(submitInterviewFeedback.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(submitInterviewFeedback.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      // Export
      .addCase(exportInterviewCsv.pending, (s) => {
        s.exporting = true;
        s.error = null;
        s.lastCsv = undefined;
      })
      .addCase(exportInterviewCsv.fulfilled, (s, a) => {
        s.exporting = false;
        s.lastCsv = a.payload;
      })
      .addCase(exportInterviewCsv.rejected, (s, a) => {
        s.exporting = false;
        s.error = a.payload as string;
      });
  },
});

export default interviewSlice.reducer;
