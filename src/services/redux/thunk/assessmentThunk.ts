import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "@/services/api/assessmentAPI";
import type { Job } from "@/services/interfaces/Assessmentinterface";

/** Jobs */
export const getAssessmentJobs = createAsyncThunk<Job[]>(
  "assessment/getJobs",
  async (_, { rejectWithValue }) => {
    try { return await api.listJobs(); }
    catch (e: any) { return rejectWithValue(e?.response?.data || "Failed to load jobs"); }
  }
);

/** Stats/KPIs */
export const getAssessmentStats = createAsyncThunk<any, { job_id: string | number }>(
  "assessment/getStats",
  async (params, { rejectWithValue }) => {
    try { return await api.getStats(params); }
    catch (e: any) { return rejectWithValue(e?.response?.data || "Failed to load stats"); }
  }
);

/** Tabbed candidates (pending/completed/expired/not_sent) */
export const getAssessmentCandidates = createAsyncThunk<
  { status: string; payload: { results: any[]; total: number } },
  { job_id: string | number; status: "pending" | "completed" | "expired" | "not_sent"; search?: string; sort?: any; page?: number; page_size?: number }
>(
  "assessment/getCandidates",
  async (params, { rejectWithValue }) => {
    try {
      const data = await api.listCandidates(params);
      return { status: params.status, payload: data };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || "Failed to load candidates");
    }
  }
);

/** Results table */
export const getAssessmentResults = createAsyncThunk<
  { results: any[]; total: number },
  { job_id: string | number; filter?: "all" | "Passed" | "Failed"; sort?: "asc" | "desc"; page?: number; page_size?: number }
>(
  "assessment/getResults",
  async (params, { rejectWithValue }) => {
    try { return await api.listResults(params); }
    catch (e: any) { return rejectWithValue(e?.response?.data || "Failed to load results"); }
  }
);

/** Export CSV */
export const exportAssessmentResults = createAsyncThunk<
  { blobUrl: string },
  { job_id: string | number; filter?: "all" | "Passed" | "Failed" }
>(
  "assessment/exportResults",
  async (params, { rejectWithValue }) => {
    try {
      const blob = await api.exportResults(params);
      const blobUrl = URL.createObjectURL(blob);
      return { blobUrl };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data || "Failed to export");
    }
  }
);

/** Actions */
export const sendAssessmentReminder = createAsyncThunk<
  { candidate_id: string | number; message: string },
  { candidate_id: string | number }
>("assessment/sendReminder", async ({ candidate_id }, { rejectWithValue }) => {
  try {
    const res = await api.sendReminder(candidate_id);
    return { candidate_id, message: res?.message || "Reminder sent" };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || "Failed to send reminder");
  }
});

export const resendAssessmentLink = createAsyncThunk<
  { candidate_id: string | number; message: string },
  { candidate_id: string | number }
>("assessment/resendLink", async ({ candidate_id }, { rejectWithValue }) => {
  try {
    const res = await api.resendLink(candidate_id);
    return { candidate_id, message: res?.message || "Link resent" };
  } catch (e: any) {
    return rejectWithValue(e?.response?.data || "Failed to resend link");
  }
});
