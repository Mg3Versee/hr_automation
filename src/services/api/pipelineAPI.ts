// import axiosInstance from "./axiosConfig";

// export type RunPipelinePayload = {
//   job_id: number | string;
//   job_title: string;
//   job_desc?: string;
//   create_assessment: boolean;
// };

// /** POST /api/run_full_pipeline */
// export async function runFullPipeline(payload: RunPipelinePayload) {
//   const { data } = await axiosInstance.post("/api/run_full_pipeline", payload);
//   // expect: { success: boolean, message?: string, pipeline_id?: string, ... }
//   if (data?.success === false) {
//     throw new Error(data?.message || "Pipeline failed");
//   }
//   return data;
// }

// /** (optional) GET /api/pipeline_status/:id — only if your backend has it */
// export async function getPipelineStatus(pipelineId: string) {
//   const { data } = await axiosInstance.get(`/api/pipeline_status/${pipelineId}`);
//   return data;
// }

// src/services/api/pipelineAPI.ts
import api from "./axiosConfig";

export type RunPipelineBody = {
  job_id: number | string;
  job_title: string;
  job_desc?: string;
  create_assessment: boolean;
};

export async function runFullPipeline(body: RunPipelineBody) {
  const res = await api.post("/api/run_full_pipeline", body);
  // backend often returns { message: "...", ... }
  return res.data ?? { message: "Pipeline started" };
}
