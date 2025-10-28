import React from "react";
import type { Job } from "./types";

const inputStyle: React.CSSProperties = { width: "100%", padding: 8, borderRadius: 8 };

type Props = {
  id: string;
  jobs: Job[];
  value: string | number | undefined;
  onChange: (next: string) => void;
  required?: boolean;
};

const JobSelect: React.FC<Props> = ({ id, jobs, value, onChange, required }) => (
  <select
    id={id}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    required={required}
    style={inputStyle}
  >
    <option value="">-- Select --</option>
    {jobs.map((j) => (
      <option key={j.id} value={String(j.id)}>
        {j.title}{j.location ? ` (${j.location})` : ""}
      </option>
    ))}
  </select>
);

export default JobSelect;
