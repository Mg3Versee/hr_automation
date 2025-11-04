// "use client";

// import React, { useEffect } from "react";
// import { Clock } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
// import { getAssessmentCandidates } from "@/services/redux/thunk/assessmentThunk";

// type Props = { jobId: number };

// const PendingList: React.FC<Props> = ({ jobId }) => {
//   const dispatch = useAppDispatch();

//   // shape assumes your slice keeps a per-status cache:
//   // state.assessment.candidatesByStatus['pending'] = Candidate[]
//   const { loading, error, candidatesByStatus } = useAppSelector((s) => s.assessment);
//   const list = candidatesByStatus?.pending ?? [];

//   useEffect(() => {
//     if (jobId) {
//       // fetch only the pending list for the current job
//       dispatch(getAssessmentCandidates({ job_id: jobId, status: "pending" }));
//     }
//   }, [dispatch, jobId]);

//   if (loading && list.length === 0) {
//     return (
//       <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
//         <p className="mt-4 text-gray-600">Loading pending candidates…</p>
//       </div>
//     );
//   }

//   if (error && list.length === 0) {
//     return (
//       <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
//         <p className="text-red-600 font-medium">Failed to load pending candidates</p>
//         <p className="text-gray-500 mt-1">{String(error)}</p>
//       </div>
//     );
//   }

//   if (list.length === 0) {
//     return (
//       <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
//         <h3 className="text-md font-semibold text-gray-900 mb-2">Pending Candidates</h3>
//         <p className="text-gray-500">No candidates are currently pending.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="p-4 border-b">
//         <h3 className="text-md font-semibold text-gray-700">Pending Candidates</h3>
//         <p className="text-sm text-gray-500">Candidates who received an assessment link but haven’t completed it yet.</p>
//       </div>

//       <ul className="divide-y">
//         {list.map((c: any) => (
//           <li key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
//             <div>
//               <p className="font-medium text-gray-900">{c.name ?? "Unnamed Candidate"}</p>
//               <p className="text-sm text-gray-500">
//                 {c.email} • invited {c.assessment_invite_date ? new Date(c.assessment_invite_date).toLocaleDateString() : "—"}
//               </p>
//             </div>
//             <div className="flex items-center text-sm text-amber-600">
//               <Clock className="w-4 h-4 mr-1" />
//               Pending
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PendingList;
