// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getJobs, getCandidates, getRecruitmentStats } from "@/services/api/dashboardAPI";

// /** Jobs */
// export const dashboardFetchJobs = createAsyncThunk(
//   "dashboard/fetchJobs",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await getJobs();
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to load jobs");
//     }
//   }
// );

// /** Candidates (optionally by job_id) */
// export const dashboardFetchCandidates = createAsyncThunk(
//   "dashboard/fetchCandidates",
//   async (job_id?: number | string, { rejectWithValue }) => {
//     try {
//       return await getCandidates(job_id);
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message || err?.message || "Failed to load candidates"
//       );
//     }
//   }
// );

// /** Recruitment charts/series */
// export const dashboardFetchRecruitmentStats = createAsyncThunk(
//   "dashboard/fetchRecruitmentStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await getRecruitmentStats();
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message || err?.message || "Failed to load recruitment stats"
//       );
//     }
//   }
// );

// /** Convenience: fetch everything the dashboard needs in parallel */
// export const dashboardRefreshAll = createAsyncThunk(
//   "dashboard/refreshAll",
//   async (_: void, { dispatch }) => {
//     const [jobs, candidates, stats] = await Promise.all([
//       dispatch(dashboardFetchJobs()).unwrap(),
//       dispatch(dashboardFetchCandidates()).unwrap(),
//       dispatch(dashboardFetchRecruitmentStats()).unwrap(),
//     ]);
//     return { jobs, candidates, stats, at: Date.now() };
//   }
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getJobs,
  getCandidates,
  getRecruitmentStats,
} from "@/services/api/dashboardAPI";

/** Jobs */
export const dashboardFetchJobs = createAsyncThunk(
  "dashboard/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      return await getJobs();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Failed to load jobs"
      );
    }
  }
);

/** Candidates (optionally by job_id) */
export const dashboardFetchCandidates = createAsyncThunk(
  "dashboard/fetchCandidates",
  async (job_id?: number | string, { rejectWithValue }) => {
    try {
      return await getCandidates(job_id);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load candidates"
      );
    }
  }
);

/** Recruitment charts/series */
export const dashboardFetchRecruitmentStats = createAsyncThunk(
  "dashboard/fetchRecruitmentStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecruitmentStats();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load recruitment stats"
      );
    }
  }
);

/** Convenience: fetch everything the dashboard needs in parallel */
export const dashboardRefreshAll = createAsyncThunk(
  "dashboard/refreshAll",
  async (_: void, { dispatch }) => {
    const [jobs, candidates, recruitmentData] = await Promise.all([
      dispatch(dashboardFetchJobs()).unwrap(),
      dispatch(dashboardFetchCandidates()).unwrap(),
      dispatch(dashboardFetchRecruitmentStats()).unwrap(),
    ]);

    // Return keys that your slice expects:
    // { jobs, candidates, recruitmentData, at }
    return { jobs, candidates, recruitmentData, at: Date.now() };
  }
);
