import api from "@/services/api/axiosConfig";
import { InterviewFeedback, InterviewResult, InterviewStats } from "@/services/interfaces/interview.interface";

/**
 * Results list.
 * Backend returns an array from GET api/candidates; we normalize to {results,total}
 * to match your slice.
 */
export async function getInterviewResults(params?: {
  job_id?: number;
  candidate_id?: number;
  page?: number;
  page_size?: number;
}): Promise<{ results: InterviewResult[]; total: number }> {
  const { data } = await api.get<InterviewResult[]>("api/candidates", {
    params,
    headers: { "Cache-Control": "no-store" },
  });

  const results = Array.isArray(data) ? data : [];
  return { results, total: results.length };
}

/**
 * Header widgets / stats.
 * Align to the working dashboard route.
 */
export async function getInterviewStats(params?: { job_id?: number }): Promise<InterviewStats> {
  const { data } = await api.get<InterviewStats>("api/recruitment-stats", {
    params,
    headers: { "Cache-Control": "no-store" },
  });
  return data;
}

/**
 * Optional: fetch individual candidate detail pieces used in the UI.
 * These mirror the endpoints used by InterviewResults.jsx.
 */
export async function getCandidateById(candidateId: number) {
  const { data } = await api.get(`api/candidates/${candidateId}`);
  return data;
}

export async function getCandidateAnalysis(candidateId: number) {
  const { data } = await api.get(`api/interview/analysis/${candidateId}`);
  return data;
}

export async function getCandidateQA(candidateId: number) {
  const { data } = await api.get(`api/interview/qa/get/${candidateId}`);
  return data;
}

export async function getCandidateProgress(candidateId: number) {
  const { data } = await api.get(`api/interview/progress/${candidateId}`);
  return data;
}

/** Feedback */
export async function postInterviewFeedback(payload: {
  result_id: number;
  feedback: InterviewFeedback;
}) {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "api/interview-results/feedback",
    payload
  );
  return data;
}

/** CSV export */
export async function exportInterviewResultsCsv(params?: { job_id?: number }) {
  const res = await api.get("api/interview-results/export", {
    params,
    responseType: "blob",
  });
  return res.data as Blob;
}
