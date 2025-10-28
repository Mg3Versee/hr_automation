import React from "react";
import { useNavigate } from "react-router-dom";
import { Job } from "../AssessmentInterface";

interface CandidatesTableProps {
  selectedJob: Job;
  activeTab: string;
  navigate: ReturnType<typeof useNavigate>;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({
  selectedJob,
  activeTab,
  navigate,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 capitalize">{activeTab} Candidates</h3>
      <p className="text-gray-500 text-sm mb-2">
        Job: {selectedJob.title} ({selectedJob.location})
      </p>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {/* Static placeholder data */}
          <tr>
            <td className="px-4 py-2 text-sm">John Doe</td>
            <td className="px-4 py-2 text-sm text-blue-600 capitalize">{activeTab}</td>
            <td className="px-4 py-2 text-sm">85%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CandidatesTable;
