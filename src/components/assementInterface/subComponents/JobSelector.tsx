// "use client"
// import { Job } from "@/services/interfaces/Assessmentinterface";
// import React, { useEffect, useState } from "react";


// interface JobSelectorProps {
//   onSelectJob: (job: Job | null) => void;
//   selectedJob: Job | null;
// }

// const JobSelector: React.FC<JobSelectorProps> = ({ onSelectJob, selectedJob }) => {
//   const [jobs, setJobs] = useState<Job[]>([]);

//   useEffect(() => {
//     // TODO: Replace with API fetch later
//     // setJobs([
//     //   { id: 1, title: "Frontend Developer", location: "Remote" },
//     //   { id: 2, title: "Backend Engineer", location: "Bangalore" },
//     // ]);
//   }, []);

//   return (
//     <div className="mb-6">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Select Job Position
//       </label>
//       <select
//         value={selectedJob?.id ?? ""}
//         onChange={(e) => {
//           const job = jobs.find((j) => j.id === Number(e.target.value));
//           onSelectJob(job || null);
//         }}
//         className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-auto text-gray-600"
//       >
//         <option value="">Select a job...</option>
//         {jobs.map((job) => (
//           <option key={job.id} value={job.id}>
//             {job.title} - {job.location}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default JobSelector;

"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import { getAssessmentJobs } from "@/services/redux/thunk/assessmentThunk";
import { setSelectedJobId } from "@/services/redux/slice/assessmentSlice";
import type { Job } from "@/services/interfaces/Assessmentinterface";

interface Props {
  onSelectJob: (job: Job | null) => void;
  selectedJob: Job | null;
}

const JobSelector: React.FC<Props> = ({ onSelectJob }) => {
  const dispatch = useAppDispatch();

  // 👇 Be defensive: default to an empty slice shape if reducer isn't ready yet
  const { jobs = [], selectedJobId = null, jobsLoading = "idle" } =
    useAppSelector((s: any) => s.assessment ?? { jobs: [], selectedJobId: null, jobsLoading: "idle" });

  useEffect(() => {
    dispatch(getAssessmentJobs());
  }, [dispatch]);

  // Derive selected job object for the parent whenever list or id changes
  useEffect(() => {
    const job =
      jobs.find((j: Job) => String(j.id) === String(selectedJobId)) ?? null;
    onSelectJob(job);
  }, [jobs, selectedJobId, onSelectJob]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Job Position
      </label>

      <select
        value={selectedJobId ?? ""}               // keep controlled
        onChange={(e) =>
          dispatch(setSelectedJobId(e.target.value ? e.target.value : null))
        }
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-auto text-gray-600"
        disabled={jobsLoading === "pending"}
      >
        <option value="">{jobsLoading === "pending" ? "Loading jobs…" : "Select a job..."}</option>
        {(jobs ?? []).map((job: Job) => (
          <option key={job.id} value={job.id}>
            {job.title} - {job.location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default JobSelector;
