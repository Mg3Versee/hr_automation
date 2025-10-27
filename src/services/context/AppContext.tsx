import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// =======================
// 🔹 Type Definitions
// =======================

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  job_id: number;
  job_title: string;
  experience: string;
  location: string;
  education: string;
  applied: string;
  skills: string[];
  score: number;
  status: string;
  statusColor: string;
  photo: string | null;
  exam_link_sent: boolean;
  exam_completed: boolean;
  exam_percentage: number | null;
  interview_scheduled: boolean;
  interview_date: string | null;
  assessment_invite_link: string | null;
}

interface Job {
  id: number;
  title: string;
  description?: string;
  [key: string]: any;
}

interface AppContextType {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  selectedCandidate: Candidate | null;
  setSelectedCandidate: React.Dispatch<React.SetStateAction<Candidate | null>>;
  jobs: Job[];
  loading: boolean;
  fetchCandidates: (jobId?: number | null) => Promise<void>;
  fetchJobs: () => Promise<void>;
  scheduleInterview: (
    candidateId: number,
    dateTime: string,
    interviewers: string[]
  ) => Promise<any>;
  runPipeline: (
    jobId: number,
    jobTitle: string,
    jobDesc?: string
  ) => Promise<any>;
  BACKEND_URL: string;
}

interface AppProviderProps {
  children: ReactNode;
}

// =======================
// 🔹 Create Context
// =======================

const AppContext = createContext<AppContextType | undefined>(undefined);

// =======================
// 🔹 Custom Hook
// =======================

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// =======================
// 🔹 Provider Component
// =======================

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

  // =======================
  // 🔹 Fetch Candidates
  // =======================
  const fetchCandidates = async (jobId: number | null = null): Promise<void> => {
    setLoading(true);
    try {
      const url = jobId
        ? `${BACKEND_URL}/api/candidates?job_id=${jobId}`
        : `${BACKEND_URL}/api/candidates`;

      const response = await fetch(url);
      const data = await response.json();

      const transformedCandidates: Candidate[] = data.map((candidate: any) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: candidate.job_title,
        job_id: candidate.job_id,
        job_title: candidate.job_title,
        experience: "5+ years",
        location: "Remote",
        education: "BS Computer Science",
        applied: candidate.processed_date,
        skills: ["Python", "React", "AWS", "Node.js", "Docker"],
        score: candidate.ats_score || 0,
        status:
          candidate.status === "Shortlisted" ? "Qualified" : "Not Qualified",
        statusColor: candidate.status === "Shortlisted" ? "green" : "red",
        photo: null,
        exam_link_sent: candidate.exam_link_sent,
        exam_completed: candidate.exam_completed,
        exam_percentage: candidate.exam_percentage,
        interview_scheduled: candidate.interview_scheduled,
        interview_date: candidate.interview_date,
        assessment_invite_link: candidate.assessment_invite_link,
      }));

      setCandidates(transformedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // 🔹 Fetch Jobs
  // =======================
  const fetchJobs = async (): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // =======================
  // 🔹 Schedule Interview
  // =======================
  const scheduleInterview = async (
    candidateId: number,
    dateTime: string,
    interviewers: string[]
  ): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/schedule-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          date: dateTime,
          time_slot: new Date(dateTime).toLocaleTimeString(),
          interviewers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCandidates();
      }
      return data;
    } catch (error) {
      console.error("Error scheduling interview:", error);
      throw error;
    }
  };

  // =======================
  // 🔹 Run Recruitment Pipeline
  // =======================
  const runPipeline = async (
    jobId: number,
    jobTitle: string,
    jobDesc: string = ""
  ): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/run_full_pipeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          job_title: jobTitle,
          job_desc: jobDesc,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error running pipeline:", error);
      throw error;
    }
  };

  // =======================
  // 🔹 Initial Data Fetch
  // =======================
  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  const value: AppContextType = {
    candidates,
    setCandidates,
    selectedCandidate,
    setSelectedCandidate,
    jobs,
    loading,
    fetchCandidates,
    fetchJobs,
    scheduleInterview,
    runPipeline,
    BACKEND_URL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
