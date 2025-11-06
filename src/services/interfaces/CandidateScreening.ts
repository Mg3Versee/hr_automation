// Types
export interface Candidate {
  id: string;
  name: string;
  email: string;
  job_id: string;
  job_title: string;
  status: string;
  final_status?: string;
  ats_score?: number;
  resume_path?: string;
  processed_date: string;
  exam_link_sent?: boolean;
  exam_started?: boolean;
  exam_completed?: boolean;
  exam_percentage?: number;
  link_expired?: boolean;
  interview_scheduled?: boolean;
  displayStatus?: string;
  displayScore?: number;
  scoreColor?: string;
  statusInfo?: StatusInfo;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  created_at?: string;
}

export interface StatusInfo {
  color: string;
  icon: any;
  priority: number;
}
