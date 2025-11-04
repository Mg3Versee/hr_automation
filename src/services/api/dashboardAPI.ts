// import axiosInstance from "./axiosConfig";

// export const getJobs = async () => {
//   const { data } = await axiosInstance.get("/api/jobs", {
//     headers: { "Cache-Control": "max-age=300" },
//   });
//   return Array.isArray(data) ? data : [];
// };

// export const getCandidates = async (job_id: string | number | undefined) => {
//   const { data } = await axiosInstance.get("/api/candidates", {
//     headers: { "Cache-Control": "max-age=300" },
//   });
//   return Array.isArray(data) ? data : [];
// };

// export const getRecruitmentStats = async () => {
//   const { data } = await axiosInstance.get("/api/recruitment-stats", {
//     headers: { "Cache-Control": "max-age=600" },
//   });
//   return Array.isArray(data) ? data : [];
// };

// // src/services/api/dashboardAPI.ts
// import api from "./axiosConfig";

// export async function getJobs() {
//   const { data } = await api.get("/api/jobs", {
//     headers: { "Cache-Control": "no-store" },
//   });
//   return Array.isArray(data) ? data : [];
// }

// export async function getCandidates(job_id?: number | string) {
//   const { data } = await api.get("/api/candidates", {
//     params: job_id ? { job_id } : undefined,
//     headers: { "Cache-Control": "no-store" },
//   });
//   return Array.isArray(data) ? data : [];
// }

// export async function getRecruitmentStats() {
//   const { data } = await api.get("/api/recruitment-stats", {
//     headers: { "Cache-Control": "no-store" },
//   });
//   return Array.isArray(data) ? data : [];
// }

import api from "@/services/api/axiosConfig";

export async function getJobs() {
  const { data } = await api.get("api/jobs", {
    headers: { "Cache-Control": "no-store" },
  });
  return Array.isArray(data) ? data : [];
}

export async function getCandidates(job_id?: number | string) {
  const { data } = await api.get("api/candidates", {
    params: job_id ? { job_id } : undefined,
    headers: { "Cache-Control": "no-store" },
  });
  return Array.isArray(data) ? data : [];
}

export async function getRecruitmentStats() {
  const { data } = await api.get("api/recruitment-stats", {
    headers: { "Cache-Control": "no-store" },
  });
  return Array.isArray(data) ? data : [];
}