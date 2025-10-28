export type Job = {
  id: string | number;
  title: string;
  location?: string;
};

export type PipelineResult = {
  success: boolean;
  error?: string;
};

export type AppContextShape = {
  runPipeline: (jobId: string | number, jobTitle: string, jobDesc?: string) => Promise<PipelineResult>;
  jobs: Job[];
};
