// import { createAsyncThunk } from "@reduxjs/toolkit";
// import * as candidateAPI from "@/services/api/candidateAPI";
// import type { Candidate, Job } from "@/services/interfaces/CandidateScreening";

// /** Candidates */
// export const getCandidates = createAsyncThunk<
//   Candidate[],
//   string | number | undefined
// >("candidate/getCandidates", async (jobId, { rejectWithValue }) => {
//   try {
//     return await candidateAPI.fetchCandidates(jobId);
//   } catch (error: any) {
//     return rejectWithValue(error?.response?.data || "Failed to fetch candidates");
//   }
// });

// /** Jobs */
// export const getJobs = createAsyncThunk<Job[]>(
//   "candidate/getJobs",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await candidateAPI.fetchJobs();
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data || "Failed to fetch jobs");
//     }
//   }
// );

// /** Pipeline status (per job) */
// export const getPipelineStatus = createAsyncThunk<
//   { jobId: string | number; data: unknown },
//   string | number
// >("candidate/getPipelineStatus", async (jobId, { rejectWithValue }) => {
//   try {
//     const data = await candidateAPI.fetchPipelineStatus(jobId);
//     return { jobId, data };
//   } catch (error: any) {
//     return rejectWithValue(error?.response?.data || "Failed to fetch pipeline status");
//   }
// });

// /** Send assessment reminder */
// export const sendAssessmentReminder = createAsyncThunk<
//   { candidateId: string | number; message: string },
//   string | number
// >("candidate/sendAssessmentReminder", async (candidateId, { rejectWithValue }) => {
//   try {
//     const data = await candidateAPI.sendReminder(candidateId);
//     return { candidateId, message: data?.message || "Reminder sent" };
//   } catch (error: any) {
//     return rejectWithValue(error?.response?.data || "Failed to send reminder");
//   }
// });

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as candidateAPI from "@/services/api/candidateAPI";
import type { Candidate, Job } from "@/services/interfaces/CandidateScreening";

/** Candidates */
export const getCandidates = createAsyncThunk<
  Candidate[],
  string | number | undefined
>("candidate/getCandidates", async (jobId, { rejectWithValue }) => {
  try {
    return await candidateAPI.fetchCandidates(jobId);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || "Failed to fetch candidates");
  }
});

/** Jobs */
export const getJobs = createAsyncThunk<Job[]>(
  "candidate/getJobs",
  async (_, { rejectWithValue }) => {
    try {
      return await candidateAPI.fetchJobs();
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to fetch jobs");
    }
  }
);

// /** Pipeline status (404 tolerated => returns {jobId, data:null}) */
// export const getPipelineStatus = createAsyncThunk<
//   { jobId: string | number; data: unknown | null },
//   string | number
// >("candidate/getPipelineStatus", async (jobId, { rejectWithValue }) => {
//   try {
//     const data = await candidateAPI.fetchPipelineStatus(jobId);
//     return { jobId, data }; // data can be null
//   } catch (error: any) {
//     return rejectWithValue(error?.response?.data || "Failed to fetch pipeline status");
//   }
// });

/** Send assessment reminder */
export const sendAssessmentReminder = createAsyncThunk<
  { candidateId: string | number; message: string },
  string | number
>("candidate/sendAssessmentReminder", async (candidateId, { rejectWithValue }) => {
  try {
    const data = await candidateAPI.sendReminder(candidateId);
    return { candidateId, message: data?.message || "Reminder sent" };
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || "Failed to send reminder");
  }
});
