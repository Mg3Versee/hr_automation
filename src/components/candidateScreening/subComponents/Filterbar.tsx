import React from "react";
import { Search } from "lucide-react";
import { Job } from "@/services/interfaces/AssementInterface";

interface FilterBarProps {
  jobs: Job[];
  selectedJob: Job | null;
  onJobChange: (job: Job | null) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  jobs,
  selectedJob,
  onJobChange,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Job Selector */}
      <select
        value={selectedJob?.id || ""}
        onChange={(e) => {
          const job = jobs.find((j) => String(j.id) === e.target.value);
          onJobChange(job || null);
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-600"
      >
        <option value="">All Jobs</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title} ({job.location})
          </option>
        ))}
      </select>

      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
        <input
          type="text"
          placeholder="Search candidates by name, email, or job title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-600"
        />
      </div>

      {/* Status Filter */}
      <select
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-600"
      >
        <option value="all">All Status</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="assessment_pending">Assessment Pending</option>
        <option value="assessment_completed">Assessment Completed</option>
        <option value="interview_scheduled">Interview Scheduled</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* Sort Options */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-600"
      >
        <option value="score_desc">Score (High to Low)</option>
        <option value="score_asc">Score (Low to High)</option>
        <option value="date_desc">Date (Newest First)</option>
        <option value="date_asc">Date (Oldest First)</option>
        <option value="name">Name (A-Z)</option>
        <option value="status">Status Priority</option>
      </select>
    </div>
  );
};

export default React.memo(FilterBar);