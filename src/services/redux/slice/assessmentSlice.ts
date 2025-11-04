import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAssessmentJobs,
  getAssessmentStats,
  getAssessmentCandidates,
  getAssessmentResults,
  exportAssessmentResults,
  sendAssessmentReminder,
  resendAssessmentLink,
} from "../thunk/assessmentThunk";
import type { Job } from "@/services/interfaces/Assessmentinterface";

type Loading = "idle" | "pending" | "succeeded" | "failed";

interface AssessmentState {
  jobs: Job[];
  selectedJobId: string | number | null;

  stats: any | null;

  candidatesByStatus: {
    pending: any[];
    completed: any[];
    expired: any[];
    not_sent: any[];
  };
  countsByStatus: Record<string, number>;

  results: any[];
  resultsTotal: number;

  jobsLoading: Loading;
  statsLoading: Loading;
  listLoading: Loading;
  resultsLoading: Loading;

  exportUrl?: string;
  message?: string | null;
  error?: string | null;
  lastUpdated?: string | null;
}

const initialState: AssessmentState = {
  jobs: [],
  selectedJobId: null,

  stats: null,

  candidatesByStatus: { pending: [], completed: [], expired: [], not_sent: [] },
  countsByStatus: {},

  results: [],
  resultsTotal: 0,

  jobsLoading: "idle",
  statsLoading: "idle",
  listLoading: "idle",
  resultsLoading: "idle",

  exportUrl: undefined,
  message: null,
  error: null,
  lastUpdated: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setSelectedJobId(state, action: PayloadAction<string | number | null>) {
      state.selectedJobId = action.payload ?? null;
    },
    clearExportUrl(state) {
      state.exportUrl = undefined;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (b) => {
    b
      // jobs
      .addCase(getAssessmentJobs.pending, (s) => { s.jobsLoading = "pending"; })
      .addCase(getAssessmentJobs.fulfilled, (s, a) => {
        s.jobsLoading = "succeeded";
        s.jobs = a.payload ?? [];
      })
      .addCase(getAssessmentJobs.rejected, (s, a) => {
        s.jobsLoading = "failed";
        s.error = (a.payload as string) || a.error.message || "Failed to load jobs";
      })

      // stats
      .addCase(getAssessmentStats.pending, (s) => { s.statsLoading = "pending"; })
      .addCase(getAssessmentStats.fulfilled, (s, a) => {
        s.statsLoading = "succeeded";
        s.stats = a.payload ?? null;
        s.lastUpdated = new Date().toISOString();
      })
      .addCase(getAssessmentStats.rejected, (s, a) => {
        s.statsLoading = "failed";
        s.error = (a.payload as string) || a.error.message || "Failed to load stats";
      })

      // candidates by status
      .addCase(getAssessmentCandidates.pending, (s) => { s.listLoading = "pending"; })
      .addCase(getAssessmentCandidates.fulfilled, (s, a) => {
        s.listLoading = "succeeded";
        const { status, payload } = a.payload;
        (s.candidatesByStatus as any)[status] = payload.results;
        s.countsByStatus[status] = payload.total;
        s.lastUpdated = new Date().toISOString();
      })
      .addCase(getAssessmentCandidates.rejected, (s, a) => {
        s.listLoading = "failed";
        s.error = (a.payload as string) || a.error.message || "Failed to load candidates";
      })

      // results
      .addCase(getAssessmentResults.pending, (s) => { s.resultsLoading = "pending"; })
      .addCase(getAssessmentResults.fulfilled, (s, a) => {
        s.resultsLoading = "succeeded";
        s.results = a.payload.results;
        s.resultsTotal = a.payload.total;
        s.lastUpdated = new Date().toISOString();
      })
      .addCase(getAssessmentResults.rejected, (s, a) => {
        s.resultsLoading = "failed";
        s.error = (a.payload as string) || a.error.message || "Failed to load results";
      })

      // export
      .addCase(exportAssessmentResults.fulfilled, (s, a) => {
        s.exportUrl = a.payload.blobUrl;
      })

      // actions
      .addCase(sendAssessmentReminder.fulfilled, (s, a) => {
        s.message = a.payload.message;
      })
      .addCase(resendAssessmentLink.fulfilled, (s, a) => {
        s.message = a.payload.message;
      });
  },
});

export const { setSelectedJobId, clearExportUrl, clearMessage } = assessmentSlice.actions;
export default assessmentSlice.reducer;
