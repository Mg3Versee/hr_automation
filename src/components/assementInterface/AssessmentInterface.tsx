import React, { useState } from "react";
import { RefreshCw, Download, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CandidatesTable from "./subComponents/CandidatesTable";
import JobSelector from "./subComponents/JobSelector";
import OverviewTab from "./subComponents/OverviewTab";
import StatsCards from "./subComponents/StatsCards";
import Tabs from "./subComponents/Tabs";
import ResultsManagement from "./subComponents/ResultsManagement";
import { Job } from "@/services/interfaces/AssementInterface";


const AssessmentInterface: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [message, setMessage] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="grow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assessment Management
            </h1>
            {selectedJob && (
              <p className="text-gray-600 mt-1">
                {selectedJob.title} • {selectedJob.location}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {activeTab !== "overview" && activeTab !== "results" && (
              <button
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Export Data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Job Selector */}
        <JobSelector onSelectJob={setSelectedJob} selectedJob={selectedJob} />

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <Award className="w-5 h-5 mr-2" />
            {message}
          </div>
        )}

        {/* Render Content */}
        {selectedJob ? (
          <>
            <StatsCards selectedJob={selectedJob} />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "overview" && (
              <OverviewTab selectedJob={selectedJob} />
            )}

            {activeTab === "results" && (
              <ResultsManagement selectedJob={selectedJob} />
            )}

            {["pending", "completed", "expired", "not_sent"].includes(
              activeTab
            ) && (
              <CandidatesTable
                selectedJob={selectedJob}
                activeTab={activeTab}
                navigate={navigate}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Job Position
            </h3>
            <p className="text-gray-500">
              Choose a job position from the dropdown above to manage
              assessments
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssessmentInterface;
