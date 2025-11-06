export interface InterviewFeedback {
  interviewer: string;
  score: number;          // 0–100
  strengths?: string;
  weaknesses?: string;
  notes?: string;
  created_at?: string;
}

export interface InterviewResult {
  id: number;
  candidate_id: number;
  candidate_name: string;
  job_id: number;
  job_title: string;
  round: string;          // e.g., "Technical", "HR"
  status: "Passed" | "Failed" | "Pending";
  score: number;          // 0–100
  scheduled_at?: string;
  completed_at?: string;
  feedback?: InterviewFeedback[];
}

export interface InterviewStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  avg_score: number;
}
