// import { Job } from "@/services/interfaces/Assessmentinterface";
// import React from "react";
// import { useRouter } from "next/navigation";


// interface CandidatesTableProps {
//   selectedJob: Job;
//   activeTab: string;
// }

// const CandidatesTable: React.FC<CandidatesTableProps> = ({
//   selectedJob,
//   activeTab,
// }) => {
//   return (
//     <div className="bg-white border rounded-lg shadow-sm p-6">
//       <h3 className="text-lg font-semibold mb-4 capitalize">{activeTab} Candidates</h3>
//       <p className="text-gray-500 text-sm mb-2">
//         Job: {selectedJob.title} ({selectedJob.location})
//       </p>

//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//               Name
//             </th>
//             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//               Status
//             </th>
//             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//               Score
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {/* Static placeholder data */}
//           <tr>
//             <td className="px-4 py-2 text-sm">John Doe</td>
//             <td className="px-4 py-2 text-sm text-blue-600 capitalize">{activeTab}</td>
//             <td className="px-4 py-2 text-sm">85%</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CandidatesTable;

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import { getAssessmentCandidates } from "@/services/redux/thunk/assessmentThunk";
import type { Job } from "@/services/interfaces/Assessmentinterface";

interface Props { selectedJob: Job; activeTab: "pending" | "completed" | "expired" | "not_sent"; }

const CandidatesTable: React.FC<Props> = ({ selectedJob, activeTab }) => {
  const dispatch = useAppDispatch();
  const { candidatesByStatus, listLoading } = useAppSelector((s) => s.assessment);
  const rows = (candidatesByStatus as any)[activeTab] ?? [];

  useEffect(() => {
    if (selectedJob?.id) {
      dispatch(getAssessmentCandidates({ job_id: selectedJob.id, status: activeTab }));
    }
  }, [dispatch, selectedJob?.id, activeTab]);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 capitalize">{activeTab} Candidates</h3>
      <p className="text-gray-500 text-sm mb-2">Job: {selectedJob.title} ({selectedJob.location})</p>

      {listLoading === "pending" ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">No candidates.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td className="px-4 py-2 text-sm">{r.name}</td>
                <td className="px-4 py-2 text-sm capitalize">{r.status ?? activeTab}</td>
                <td className="px-4 py-2 text-sm">{r.score ?? r.ats_score ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default CandidatesTable;
