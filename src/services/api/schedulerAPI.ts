// import api from "./axiosConfig";

// /** Raw types returned by backend */
// export type RawCandidate = {
//   id: number | string;
//   name?: string;
//   email?: string;
//   job_id?: number | string;
//   job_title?: string;
//   role?: string;
//   resume_path?: string | null;
//   photo?: string | null;
//   job_description?: string | null;
//   interview_scheduled?: boolean;
// };

// export type ScheduleResponse = {
//   success: boolean;
//   already_scheduled?: boolean;
//   interview_link?: string;
//   knowledge_base_id?: string;
//   resume_extracted?: boolean;
//   job_description_used?: boolean;
//   email_sent?: boolean;
//   message?: string;
// };

// export async function fetchCandidatesAPI(jobId?: number | string): Promise<RawCandidate[]> {
//   const { data } = await api.get("api/candidates", {
//     params: jobId ? { job_id: jobId } : undefined,
//     headers: { "Cache-Control": "no-store" },
//   });
//   return Array.isArray(data) ? data : [];
// }

// export async function scheduleInterviewAPI(payload: {
//   candidate_id: number | string;
//   email: string;
//   date_iso: string;     // ISO string
//   time_slot: string;    // e.g. "2:30 PM"
//   job_description?: string | null;
// }): Promise<ScheduleResponse> {
//   const { data } = await api.post("api/schedule-interview", {
//     candidate_id: payload.candidate_id,
//     email: payload.email,
//     date: payload.date_iso,
//     time_slot: payload.time_slot,
//     job_description: payload.job_description ?? null,
//   });
//   return data as ScheduleResponse;
// }

// src/services/api/schedulerAPI.ts
export type RawCandidate = {
  id: number | string;
  name: string;
  email?: string;
  role?: string;
  job_id?: string;
  job_title?: string;
  job_description?: string;
  photo?: string | null;
  resume_path?: string | null;
};

export type SchedulePayload = {
  candidate_id: number | string;
  email: string;
  date_iso: string;
  time_slot: string;
  job_description?: string | null;
};

export type ScheduleResponse = {
  success: boolean;
  message?: string;
  interview_link?: string;
  already_scheduled?: boolean;
  knowledge_base_id?: string;
  resume_extracted?: boolean;
  job_description_used?: boolean;
  email_sent?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/** Fetch all or job-specific candidates */
export async function fetchCandidates(jobId?: string): Promise<RawCandidate[]> {
  const url = jobId
    ? `${API_BASE}/scheduler/candidates?jobId=${encodeURIComponent(jobId)}`
    : `${API_BASE}/scheduler/candidates`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch candidates");
  return res.json();
}

/** Schedule an interview for a candidate */
export async function scheduleInterview(
  payload: SchedulePayload
): Promise<ScheduleResponse> {
  const res = await fetch(`${API_BASE}/scheduler/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to schedule interview");
  return res.json();
}
