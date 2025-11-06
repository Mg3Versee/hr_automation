// import axiosInstance from "@/services/api/axiosConfig";
// import type { Job } from "@/services/interfaces/Assessmentinterface";

// /** Jobs used by Assessments */
// export async function fetchJobs(): Promise<Job[]> {
//   const { data } = await axiosInstance.get<Job[]>("api/jobs");
//   return data ?? [];
// }
// /** KPI cards on the page (totals, pass rate, etc.) */
// export async function getStats(params: { job_id: string | number }) {
//   const { data } = await axiosInstance.get("api/assessments/stats", { params });
//   return data;
// }

// /** Candidates for a given status tab (pending/completed/expired/not_sent) */
// export async function listCandidates(params: {
//   job_id: string | number;
//   status: "pending" | "completed" | "expired" | "not_sent";
//   search?: string;
//   sort?: "score_asc" | "score_desc" | "date_asc" | "date_desc";
//   page?: number;
//   page_size?: number;
// }) {
//   const { data } = await axiosInstance.get("api/assessments/candidates", {
//     params,
//   });
//   return {
//     results: Array.isArray(data?.results) ? data.results : [],
//     total: Number(data?.total ?? 0),
//   };
// }

// /** Results table (scores) */
// export async function listResults(params: {
//   job_id: string | number;
//   filter?: "all" | "Passed" | "Failed";
//   sort?: "asc" | "desc";
//   page?: number;
//   page_size?: number;
// }) {
//   const { data } = await axiosInstance.get("api/assessments/results", {
//     params,
//   });
//   return {
//     results: Array.isArray(data?.results) ? data.results : [],
//     total: Number(data?.total ?? 0),
//   };
// }

// /** Export results as CSV */
// export async function exportResults(params: {
//   job_id: string | number;
//   filter?: "all" | "Passed" | "Failed";
// }) {
//   const res = await axiosInstance.get("api/assessments/results/export", {
//     params,
//     responseType: "blob",
//   });
//   return res.data as Blob;
// }

// /** Actions */
// export async function sendReminder(candidate_id: string | number) {
//   const { data } = await axiosInstance.post("api/assessments/reminder", {
//     candidate_id,
//   });
//   return data;
// }

// export async function resendLink(candidate_id: string | number) {
//   const { data } = await axiosInstance.post("api/assessments/resend", {
//     candidate_id,
//   });
//   return data;
// }

// // src/services/api/assessmentAPI.ts
// import axiosInstance from "@/services/api/axiosConfig";
// import type { Job } from "@/services/interfaces/Assessmentinterface";

// /** Jobs used by Assessments */
// export async function listJobs(): Promise<Job[]> {
//   const { data } = await axiosInstance.get<Job[]>("api/jobs");
//   return data ?? [];
// }

// /** KPI cards on the page (totals, pass rate, etc.) */
// export async function getStats(params: { job_id: string | number }) {
//   const { data } = await axiosInstance.get("api/assessments/stats", { params });
//   return data;
// }

// /** Candidates for a given status tab (pending/completed/expired/not_sent) */
// export async function listCandidates(params: {
//   job_id: string | number;
//   status: "pending" | "completed" | "expired" | "not_sent";
//   search?: string;
//   sort?: "score_asc" | "score_desc" | "date_asc" | "date_desc";
//   page?: number;
//   page_size?: number;
// }) {
//   const { data } = await axiosInstance.get("api/assessments/candidates", {
//     params,
//   });
//   return {
//     results: Array.isArray(data?.results) ? data.results : [],
//     total: Number(data?.total ?? 0),
//   };
// }

// /** Results table (scores) */
// export async function listResults(params: {
//   job_id: string | number;
//   filter?: "all" | "Passed" | "Failed";
//   sort?: "asc" | "desc";
//   page?: number;
//   page_size?: number;
// }) {
//   const { data } = await axiosInstance.get("api/assessments/results", {
//     params,
//   });
//   return {
//     results: Array.isArray(data?.results) ? data.results : [],
//     total: Number(data?.total ?? 0),
//   };
// }

// /** Export results as CSV */
// export async function exportResults(params: {
//   job_id: string | number;
//   filter?: "all" | "Passed" | "Failed";
// }) {
//   const res = await axiosInstance.get("api/assessments/results/export", {
//     params,
//     responseType: "blob",
//   });
//   return res.data as Blob;
// }

// /** Actions */
// export async function sendReminder(candidate_id: string | number) {
//   const { data } = await axiosInstance.post("api/assessments/reminder", {
//     candidate_id,
//   });
//   return data;
// }

// export async function resendLink(candidate_id: string | number) {
//   const { data } = await axiosInstance.post("api/assessments/resend", {
//     candidate_id,
//   });
//   return data;
// }

// src/services/api/assessmentAPI.ts
import api from "@/services/api/axiosConfig";
import type { Job } from "@/services/interfaces/Assessmentinterface";

/** Jobs used by Assessments */
export async function listJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>("/api/jobs");
  return Array.isArray(data) ? data : [];
}

/** KPI cards on the page (totals, pass rate, etc.) */
export async function getStats(params: { job_id: string | number }) {
  const { data } = await api.get("/api/scrape_assessment_results", { params });
  return data;
}

/** Candidates for a given status tab */
export async function listCandidates(params: {
  job_id: string | number;
  status: "pending" | "completed" | "expired" | "not_sent";
  search?: string;
  sort?: "score_asc" | "score_desc" | "date_asc" | "date_desc";
  page?: number;
  page_size?: number;
}) {
  const { data } = await api.get("/api/candidates", { params });
  return {
    results: Array.isArray(data?.results) ? data.results : [],
    total: Number(data?.total ?? 0),
  };
}

/** Results table (scores) */
export async function listResults(params: {
  job_id: string | number;
  filter?: "all" | "Passed" | "Failed";
  sort?: "asc" | "desc";
  page?: number;
  page_size?: number;
}) {
  const { data } = await api.get("/api/scrape_assessment_results", { params });
  return {
    results: Array.isArray(data?.results) ? data.results : [],
    total: Number(data?.total ?? 0),
  };
}

/** Export results as CSV */
export async function exportResults(params: {
  job_id: string | number;
  filter?: "all" | "Passed" | "Failed";
}) {
  const res = await api.get("/api/scrape_all_pending_results", {
    params,
    responseType: "blob",
  });
  return res.data as Blob;
}

/** Actions */
export async function sendReminder(candidate_id: string | number) {
  const { data } = await api.post("/api/assessments/reminder", { candidate_id });
  return data;
}

export async function resendLink(candidate_id: string | number) {
  const { data } = await api.post("/api/assessments/resend", { candidate_id });
  return data;
}
