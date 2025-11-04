// // import axiosInstance from "./axiosConfig";
// // import type { Candidate } from "./dashboardAPI";

// // export const fetchCandidates = async (jobId?: string) => {
// //   const url = jobId ? `/api/candidates?job_id=${jobId}` : "/api/candidates";
// //   const response = await axiosInstance.get(url);
// //   return response.data;
// // };

// // export const fetchJobs = async () => {
// //   const response = await axiosInstance.get("/api/jobs");
// //   return response.data;
// // };

// // export const fetchPipelineStatus = async (jobId: string) => {
// //   const response = await axiosInstance.get(`/api/pipeline_status/${jobId}`);
// //   return response.data;
// // };

// // export const sendReminder = async (candidateId: string) => {
// //   const response = await axiosInstance.post(`/api/send_reminder/${candidateId}`);
// //   return response.data;
// // };

// // // src/services/api/candidateAPI.ts
// // import api from "./axiosConfig";

// // export type Candidate = Record<string, any>;

// // export async function getJobs() {
// //   const { data } = await api.get("api/jobs", {
// //     headers: { "Cache-Control": "no-store" },
// //   });
// //   return Array.isArray(data) ? data : [];
// // }

// // export async function listCandidates(params?: { job_id?: string | number }) {
// //   const { data } = await api.get("/api/candidates", { params });
// //   return Array.isArray(data) ? (data as Candidate[]) : [];
// // }

// // export async function getCandidate(id: string | number) {
// //   const { data } = await api.get(`/api/candidates/${id}`);
// //   return data as Candidate;
// // }

// // export async function updateCandidate(
// //   id: string | number,
// //   body: Partial<Candidate>
// // ) {
// //   const { data } = await api.patch(`/api/candidates/${id}`, body);
// //   return data as Candidate;
// // }

// import axiosInstance from "@/services/api/axiosConfig";
// import type { Candidate, Job } from "@/services/interfaces/CandidateScreening";

// /** GET /api/jobs */
// export async function fetchJobs(): Promise<Job[]> {
//   const { data } = await axiosInstance.get<Job[]>("api/jobs");
//   return data ?? [];
// }

// /** GET /api/candidates?job_id=... */
// export async function fetchCandidates(jobId?: string | number): Promise<Candidate[]> {
//   const { data } = await axiosInstance.get<Candidate[]>("api/candidates", {
//     params: jobId ? { job_id: jobId } : undefined,
//   });

//   // Normalize a few fields your UI expects
//   return (data ?? []).map((c) => ({
//     ...c,
//     ats_score: c.ats_score ?? (c as any).score ?? 0,
//     processed_date:
//       (c as any).processed_date ??
//       (c as any).created_at ??
//       (c as any).updated_at ??
//       null,
//   }));
// }

// /** Optional: GET pipeline status per job (adjust route if yours differs) */
// export async function fetchPipelineStatus(jobId: string | number) {
//   const { data } = await axiosInstance.get(`api/pipeline/status`, {
//     params: { job_id: jobId },
//   });
//   return data;
// }

// /** POST /api/assessments/reminder { candidate_id } */
// export async function sendReminder(candidateId: string | number) {
//   const { data } = await axiosInstance.post("api/assessments/reminder", {
//     candidate_id: candidateId,
//   });
//   return data;
// }

import axiosInstance from "@/services/api/axiosConfig";
import type { Candidate, Job } from "@/services/interfaces/CandidateScreening";

/** GET /api/jobs */
export async function fetchJobs(): Promise<Job[]> {
  const { data } = await axiosInstance.get<Job[]>("api/jobs");
  return data ?? [];
}

/** GET /api/candidates?job_id=... */
export async function fetchCandidates(jobId?: string | number): Promise<Candidate[]> {
  const { data } = await axiosInstance.get<Candidate[]>("api/candidates", {
    params: jobId ? { job_id: jobId } : undefined,
  });

  return (data ?? []).map((c) => ({
    ...c,
    ats_score: c.ats_score ?? (c as any).score ?? 0,
    processed_date:
      (c as any).processed_date ??
      (c as any).created_at ??
      (c as any).updated_at ??
      null,
  }));
}

/** POST /api/assessments/reminder { candidate_id } */
export async function sendReminder(candidateId: string | number) {
  const { data } = await axiosInstance.post("api/assessments/reminder", {
    candidate_id: candidateId,
  });
  return data;
}
