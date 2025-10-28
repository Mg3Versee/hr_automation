import React, { useMemo, useState } from "react";
import { AppContextShape, Job } from "./subComponents/types";
import Field from "./subComponents/Field";
import JobSelect from "./subComponents/JobSelect";
import MessageBanner from "./subComponents/MessageBanner";


const wrapperStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: 12,
  padding: 24,
  maxWidth: 520,
  margin: "32px auto",
  background: "#fafbfc",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
};

const inputStyle: React.CSSProperties = { width: "100%", padding: 8, borderRadius: 8 };

const RecruitmentForm: React.FC = () => {
  const { runPipeline, jobs } = useAppContext() as unknown as AppContextShape;

  const [jobId, setJobId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [kind, setKind] = useState<"success" | "error" | null>(null);

  const jobById = useMemo(() => {
    const map = new Map<string, Job>();
    for (const j of jobs ?? []) map.set(String(j.id), j);
    return map;
  }, [jobs]);

  const handleJobChange = (id: string) => {
    setJobId(id);
    const job = jobById.get(String(id));
    if (job?.title) setJobTitle(job.title);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!jobId || !jobTitle) return;

    setLoading(true);
    setMessage("");
    setKind(null);

    try {
      const result = await runPipeline(jobId, jobTitle, jobDesc);
      if (result?.success) {
        setKind("success");
        setMessage("✅ Pipeline started successfully!");
      } else {
        setKind("error");
        setMessage("❌ Failed to start pipeline: " + (result?.error || "Unknown error"));
      }
    } catch (err: unknown) {
      setKind("error");
      setMessage("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={wrapperStyle} aria-busy={loading}>
      <h2 style={{ marginBottom: 20 }}>Start New Recruitment Pipeline</h2>

      <Field id="job" label="Select Job:" required>
        <JobSelect id="job" jobs={jobs ?? []} value={jobId} onChange={handleJobChange} required />
      </Field>

      <Field id="title" label="Job Title:" required>
        <input
          id="title"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title"
          required
          style={inputStyle}
        />
      </Field>

      <Field id="desc" label="Job Description:" hint="Optional">
        <textarea
          id="desc"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Enter job description (optional)"
          style={{ ...inputStyle, minHeight: 96 }}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          background: "#2a7cff",
          color: "#fff",
          border: "none",
          fontWeight: "bold",
          fontSize: 16,
          opacity: loading ? 0.85 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Starting…" : "Start Pipeline"}
      </button>

      {message && kind && <MessageBanner kind={kind} message={message} />}
    </form>
  );
};

export default RecruitmentForm;
function useAppContext(): unknown {
    throw new Error("Function not implemented.");
}

