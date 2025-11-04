// "use client"
// import React, { useState } from "react";
// import { Download, Filter, BarChart2, Eye } from "lucide-react";
// import { Job } from "@/services/interfaces/Assessmentinterface";


// interface CandidateResult {
//   id: number;
//   name: string;
//   email: string;
//   score: number;
//   status: "Passed" | "Failed";
//   date: string;
// }

// interface ResultsManagementProps {
//   selectedJob: Job;
// }

// const ResultsManagement: React.FC<ResultsManagementProps> = ({ selectedJob }) => {
//   const [filter, setFilter] = useState<string>("all");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

//   // Static mock data — replace with backend data later
//   const results: CandidateResult[] = [
//     {
//       id: 1,
//       name: "John Doe",
//       email: "john@example.com",
//       score: 87,
//       status: "Passed",
//       date: "2025-10-25",
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       email: "jane@example.com",
//       score: 68,
//       status: "Failed",
//       date: "2025-10-26",
//     },
//     {
//       id: 3,
//       name: "Alex Johnson",
//       email: "alex@example.com",
//       score: 92,
//       status: "Passed",
//       date: "2025-10-28",
//     },
//   ];

//   // Apply filtering and sorting
//   const filteredResults = results
//     .filter((r) => (filter === "all" ? true : r.status === filter))
//     .sort((a, b) =>
//       sortOrder === "asc" ? a.score - b.score : b.score - a.score
//     );

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">
//             Results Management
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Job: {selectedJob.title} • {selectedJob.location}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
//           {/* Filter Dropdown */}
//           <div className="relative">
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All</option>
//               <option value="Passed">Passed</option>
//               <option value="Failed">Failed</option>
//             </select>
//           </div>

//           {/* Sort Button */}
//           <button
//             onClick={() =>
//               setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
//             }
//             className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
//           >
//             <Filter className="w-4 h-4 mr-2" />
//             {sortOrder === "asc" ? "Low → High" : "High → Low"}
//           </button>

//           {/* Export Button */}
//           <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
//                 Candidate
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
//                 Score
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-4 py-2 text-right font-medium text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {filteredResults.map((result) => (
//               <tr key={result.id}>
//                 <td className="px-4 py-2 font-medium text-gray-900">
//                   {result.name}
//                 </td>
//                 <td className="px-4 py-2 text-gray-600">{result.email}</td>
//                 <td className="px-4 py-2 font-semibold">{result.score}%</td>
//                 <td>
//                   <span
//                     className={`px-2 py-1 text-xs rounded-full font-medium ${
//                       result.status === "Passed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {result.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2 text-gray-500">{result.date}</td>
//                 <td className="px-4 py-2 text-right">
//                   <button className="flex items-center text-blue-600 hover:underline text-sm">
//                     <Eye className="w-4 h-4 mr-1" /> View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredResults.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No results found for the selected filter.
//           </div>
//         )}
//       </div>

//       {/* Analytics Summary */}
//       <div className="mt-6 border-t pt-4">
//         <div className="flex items-center space-x-3 text-gray-600">
//           <BarChart2 className="w-5 h-5 text-blue-600" />
//           <p className="text-sm">
//             Average Score:{" "}
//             <span className="font-semibold text-gray-900">
//               {(
//                 results.reduce((acc, r) => acc + r.score, 0) / results.length
//               ).toFixed(1)}
//               %
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultsManagement;

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Download, Filter, BarChart2, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import { getAssessmentResults, exportAssessmentResults } from "@/services/redux/thunk/assessmentThunk";
import { clearExportUrl } from "@/services/redux/slice/assessmentSlice";
import type { Job } from "@/services/interfaces/Assessmentinterface";

interface Props { selectedJob: Job; }

const ResultsManagement: React.FC<Props> = ({ selectedJob }) => {
  const dispatch = useAppDispatch();
  const { results, resultsLoading, exportUrl } = useAppSelector((s) => s.assessment);

  const [filter, setFilter] = useState<"all" | "Passed" | "Failed">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (selectedJob?.id) {
      dispatch(getAssessmentResults({ job_id: selectedJob.id, filter, sort: sortOrder }));
    }
  }, [dispatch, selectedJob?.id, filter, sortOrder]);

  useEffect(() => {
    if (exportUrl) {
      const a = document.createElement("a");
      a.href = exportUrl;
      a.download = `assessment-results-${selectedJob.id}.csv`;
      a.click();
      dispatch(clearExportUrl());
    }
  }, [exportUrl, dispatch, selectedJob?.id]);

  const filtered = useMemo(() => results, [results]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Results Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Job: {selectedJob.title} • {selectedJob.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="all">All</option>
            <option value="Passed ">Passed</option>
            <option value="Failed">Failed</option>
          </select>

          <button
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            className="flex items-center px-3 py-2 border border-blue-600 rounded-lg text-sm hover:bg-gray-50 text-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            {sortOrder === "asc" ? "Low → High" : "High → Low"}
          </button>

          <button
            onClick={() => dispatch(exportAssessmentResults({ job_id: selectedJob.id, filter }))}
            className="flex items-center px-3 py-2 border border-green-600 rounded-lg text-sm hover:bg-gray-70 text-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {resultsLoading === "pending" ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">Candidate</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((r: any) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-2 text-gray-600">{r.email}</td>
                    <td className="px-4 py-2 font-semibold">{r.score}%</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        r.status === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{r.date}</td>
                    <td className="px-4 py-2 text-right">
                      <button className="flex items-center text-blue-600 hover:underline text-sm">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-8 text-gray-500">No results.</div>}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <p className="text-sm">
                Average Score:{" "}
                <span className="font-semibold text-gray-900">
                  {filtered.length
                    ? (filtered.reduce((a: number, r: any) => a + (r.score ?? 0), 0) / filtered.length).toFixed(1)
                    : 0}
                  %
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsManagement;
