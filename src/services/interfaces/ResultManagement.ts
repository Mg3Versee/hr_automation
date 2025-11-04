// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Candidate = {
  id: number;
  name: string;
  email: string;
  exam_link_sent?: boolean;
  exam_link_sent_date?: string | null;
  exam_completed?: boolean;
  exam_completed_date?: string | null;
  link_expired?: boolean;
  exam_percentage?: number;
  exam_feedback?: string | null;
  assessment_invite_link?: string | null;
  final_status?: string | null;
};

