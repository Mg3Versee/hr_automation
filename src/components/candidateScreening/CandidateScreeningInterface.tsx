"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, CheckCircle, Calendar, Send, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

import FilterBar from "./subComponents/Filterbar";
import CandidateCard from "./subComponents/Candidatecard";
import CandidateListSkeleton from "./subComponents/candidates_Skeleton";
import CandidateDetails from "./subComponents/Candidate_Details";

import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import {
  getJobs,
  getCandidates,
  sendAssessmentReminder as sendAssessmentReminderThunk,
} from "@/services/redux/thunk/candidateThunk";
import { setSelectedJobId, clearMessage } from "@/services/redux/slice/candidateSlice";

import type { Candidate, Job, StatusInfo } from "@/services/interfaces/CandidateScreening";
export const STATUS_MAP: Record<string, StatusInfo> = {
  Hired: { color: "bg-green-100 text-green-800", icon: CheckCircle, priority: 8 },
  "Interview Scheduled": { color: "bg-blue-100 text-blue-800", icon: Calendar, priority: 7 },
  "Assessment Passed": { color: "bg-green-100 text-green-800", icon: CheckCircle, priority: 6 },
  "Assessment Failed": { color: "bg-red-100 text-red-800", icon: CheckCircle, priority: 5 },
  "Assessment In Progress": { color: "bg-yellow-100 text-yellow-800", icon: Calendar, priority: 4 },
  "Assessment Sent": { color: "bg-blue-100 text-blue-800", icon: Send, priority: 3 },
  "Assessment Expired": { color: "bg-gray-100 text-gray-800", icon: Calendar, priority: 2 },
  Shortlisted: { color: "bg-green-100 text-green-800", icon: CheckCircle, priority: 2 },
  Rejected: { color: "bg-red-100 text-red-800", icon: CheckCircle, priority: 1 },
  "Under Review": { color: "bg-gray-100 text-gray-800", icon: Calendar, priority: 0 },
};

const getDisplayStatus = (c: Candidate): string => {
  if (c?.final_status === "Hired") return "Hired";
  if (c?.interview_scheduled) return "Interview Scheduled";
  if (c?.exam_completed) return (c?.exam_percentage ?? 0) >= 70 ? "Assessment Passed" : "Assessment Failed";
  if (c?.exam_started) return "Assessment In Progress";
  if (c?.exam_link_sent) return c?.link_expired ? "Assessment Expired" : "Assessment Sent";
  if (c?.status === "Shortlisted") return "Shortlisted";
  if (c?.status === "Rejected" || c?.final_status === "Rejected After Exam") return "Rejected";
  return "Under Review";
};
const getCandidateStatusInfo = (c: Candidate): StatusInfo =>
  STATUS_MAP[getDisplayStatus(c)] ?? STATUS_MAP["Under Review"];
const getScoreColor = (s = 0) =>
  s >= 85 ? "text-green-600" : s >= 70 ? "text-yellow-600" : "text-red-600";

export default function CandidateScreeningInterface() {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const jobIdFromUrl = params.get("job_id");

  const {
    jobs,
    candidates,
    jobsLoading,
    candidatesLoading,
    error,
    lastFetchTime,
    selectedJobId,
    message,
  } = useAppSelector((s) => s.candidate);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("score_desc");

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobIdFromUrl && jobs.length) {
      const found = jobs.find((j) => String(j.id) === String(jobIdFromUrl));
      if (found) dispatch(setSelectedJobId(found.id as any));
    }
  }, [jobIdFromUrl, jobs, dispatch]);

  useEffect(() => {
    dispatch(getCandidates(selectedJobId ?? undefined));
  }, [dispatch, selectedJobId]);

  useEffect(() => {
    if (candidates.length && !selectedCandidate) setSelectedCandidate(candidates[0]);
  }, [candidates, selectedCandidate]);

  const selectedJob: Job | null = useMemo(
    () => (selectedJobId ? jobs.find((j) => String(j.id) === String(selectedJobId)) ?? null : null),
    [jobs, selectedJobId]
  );

  const processedCandidates = useMemo(
    () =>
      candidates.map((c) => ({
        ...c,
        displayStatus: getDisplayStatus(c),
        displayScore: c?.ats_score || 0,
        scoreColor: getScoreColor(c?.ats_score || 0),
        statusInfo: getCandidateStatusInfo(c),
      })),
    [candidates]
  );

  const filteredCandidates = useMemo(() => {
    let filtered = processedCandidates;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.job_title?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((c) => {
        switch (filterStatus) {
          case "shortlisted":
            return c.status === "Shortlisted";
          case "assessment_pending":
            return c.exam_link_sent && !c.exam_completed && !c.link_expired;
          case "assessment_completed":
            return c.exam_completed;
          case "interview_scheduled":
            return c.interview_scheduled;
          case "rejected":
            return c.status === "Rejected" || c.final_status === "Rejected After Exam";
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "score_desc":
          return (b.ats_score || 0) - (a.ats_score || 0);
        case "score_asc":
          return (a.ats_score || 0) - (b.ats_score || 0);
        case "date_desc":
          return +new Date(b.processed_date) - +new Date(a.processed_date);
        case "date_asc":
          return +new Date(a.processed_date) - +new Date(b.processed_date);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "status":
          return (b.statusInfo?.priority || 0) - (a.statusInfo?.priority || 0);
        default:
          return 0;
      }
    });
  }, [processedCandidates, searchTerm, filterStatus, sortBy]);

  const refreshData = async () => {
    await dispatch(getJobs()).unwrap();
    await dispatch(getCandidates(selectedJobId ?? undefined)).unwrap();
  };

  const sendAssessmentReminder = async (candidateId: string | number) => {
    await dispatch(sendAssessmentReminderThunk(candidateId)).unwrap();
    setTimeout(() => dispatch(clearMessage()), 3000);
    dispatch(getCandidates(selectedJobId ?? undefined));
  };

  return (
    <div className="p-6">
        <div className="mb-6 flex items-center justify-between space-x-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Screening</h1>
            {selectedJob && (
              <div className="mt-1 flex items-center space-x-6">
                <p className="text-gray-600">
                  {selectedJob.title} • {selectedJob.location} • {filteredCandidates.length} candidates
                </p>
                {lastFetchTime && (
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(lastFetchTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={refreshData}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 flex items-center rounded-lg bg-green-100 p-4 text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            {message}
          </div>
        )}

        {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">Error: {error}</div>}

        <FilterBar
          jobs={jobs}
          selectedJob={selectedJob}
          onJobChange={(job) => dispatch(setSelectedJobId(job?.id as any))}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Candidate list */}
          <div className="lg:w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-700">Candidates</h2>
                <span className="text-sm text-gray-500">
                  {filteredCandidates.length} of {candidates.length}
                </span>
              </div>
            </div>

            <div className="max-h-[calc(100vh-300px)] divide-y divide-gray-200 overflow-y-auto">
              {candidatesLoading === "pending" ? (
                <CandidateListSkeleton />
              ) : filteredCandidates.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-lg font-medium">No candidates found</p>
                  <p className="mt-1">
                    {candidates.length === 0
                      ? "Try adjusting your filters"
                      : "Try adjusting your search or filters"}
                  </p>
                </div>
              ) : (
                filteredCandidates.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    isSelected={selectedCandidate?.id === c.id}
                    onClick={() => setSelectedCandidate(c)}
                  />
                ))
              )}
            </div>
          </div>

        {/* Candidate details */}
          <div className="lg:w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-medium text-gray-700">Candidate Details</h2>
            </div>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <CandidateDetails
                candidate={selectedCandidate}
                onSendReminder={(id) => sendAssessmentReminder(id)}
              />
            </div>
          </div>
        </div>
    </div>
  );
}
