"use client";
import React, { useState } from "react";
import { RefreshCw, Download, Award } from "lucide-react";
import CandidatesTable from "./subComponents/CandidatesTable";
import JobSelector from "./subComponents/JobSelector";
import OverviewTab from "./subComponents/OverviewTab";
import StatsCards from "./subComponents/StatsCards";
import Tabs from "./subComponents/Tabs";
import ResultsManagement from "./subComponents/ResultsManagement";
import { Job } from "@/services/interfaces/Assessmentinterface";
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import { getAssessmentStats, getAssessmentCandidates, getAssessmentResults, exportAssessmentResults} from "@/services/redux/thunk/assessmentThunk";


const AssessmentInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { selectedJobId } = useAppSelector((s) => s.assessment);

  const onRefresh = () => {
    if (!selectedJob?.id) return;
    dispatch(getAssessmentStats({ job_id: selectedJob.id }));
    if (["pending","completed","expired","not_sent"].includes(activeTab)) {
      dispatch(getAssessmentCandidates({ job_id: selectedJob.id, status: activeTab as any }));
    }
    if (activeTab === "results") {
      dispatch(getAssessmentResults({ job_id: selectedJob.id }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="grow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
            {selectedJob && <p className="text-gray-600 mt-1">{selectedJob.title} • {selectedJob.location}</p>}
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50" title="Refresh Data" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </button>
            {activeTab !== "overview" && activeTab !== "results" && (
              <button
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Export Data"
                onClick={() => selectedJob?.id && dispatch(exportAssessmentResults({ job_id: selectedJob.id }))}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>

        <JobSelector onSelectJob={setSelectedJob} selectedJob={selectedJob} />

        {/* Success toasts can be shown from slice.message if desired */}

        {selectedJob ? (
          <>
            <StatsCards selectedJob={selectedJob} />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "overview" && <OverviewTab selectedJob={selectedJob} />}
            {activeTab === "results" && <ResultsManagement selectedJob={selectedJob} />}
            {["pending","completed","expired","not_sent"].includes(activeTab) && (
              <CandidatesTable selectedJob={selectedJob} activeTab={activeTab as any} />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Job Position</h3>
            <p className="text-gray-500">Choose a job position from the dropdown above to manage assessments</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssessmentInterface;

