import React, { useEffect, useState } from "react";
import { Job } from "../AssessmentInterface";

interface JobSelectorProps {
  onSelectJob: (job: Job | null) => void;
  selectedJob: Job | null;
}

const JobSelector: React.FC<JobSelectorProps> = ({ onSelectJob, selectedJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // TODO: Replace with API fetch later
    setJobs([
      { id: 1, title: "Frontend Developer", location: "Remote" },
      { id: 2, title: "Backend Engineer", location: "Bangalore" },
    ]);
  }, []);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Job Position
      </label>
      <select
        value={selectedJob?.id ?? ""}
        onChange={(e) => {
          const job = jobs.find((j) => j.id === Number(e.target.value));
          onSelectJob(job || null);
        }}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
      >
        <option value="">Select a job...</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title} - {job.location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default JobSelector;
