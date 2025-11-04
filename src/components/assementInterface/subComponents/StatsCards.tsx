// import React from "react";
// import { Send, CheckCircle, BarChart, Award } from "lucide-react";
// import { Job } from "@/services/interfaces/Assessmentinterface";


// interface StatsCardsProps {
//   selectedJob: Job;
// }

// const StatsCards: React.FC<StatsCardsProps> = ({ selectedJob }) => {
//   const stats = {
//     totalSent: 10,
//     totalCompleted: 6,
//     avgScore: 82.5,
//     passRate: 70,
//   };

//   const cards = [
//     { label: "Total Sent", value: stats.totalSent, icon: Send, color: "text-blue-600" },
//     { label: "Completed", value: stats.totalCompleted, icon: CheckCircle, color: "text-green-600" },
//     { label: "Average Score", value: `${stats.avgScore}%`, icon: BarChart, color: "text-purple-600" },
//     { label: "Pass Rate", value: `${stats.passRate}%`, icon: Award, color: "text-yellow-600" },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       {cards.map(({ label, value, icon: Icon, color }) => (
//         <div key={label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">{label}</p>
//               <p className="text-2xl font-bold text-gray-900">{value}</p>
//             </div>
//             <Icon className={`w-8 h-8 ${color}`} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StatsCards;

import React, { useEffect } from "react";
import { Send, CheckCircle, BarChart, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import { getAssessmentStats } from "@/services/redux/thunk/assessmentThunk";
import type { Job } from "@/services/interfaces/Assessmentinterface";

interface Props { selectedJob: Job; }

const StatsCards: React.FC<Props> = ({ selectedJob }) => {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((s) => s.assessment);

  useEffect(() => {
    if (selectedJob?.id) dispatch(getAssessmentStats({ job_id: selectedJob.id }));
  }, [dispatch, selectedJob?.id]);

  const values = {
    totalSent: stats?.total_sent ?? 0,
    totalCompleted: stats?.completed ?? 0,
    avgScore: stats?.avg_score ?? 0,
    passRate: stats?.pass_rate ?? 0,
  };

  const cards = [
    { label: "Total Sent", value: values.totalSent, icon: Send, color: "text-blue-600" },
    { label: "Completed", value: values.totalCompleted, icon: CheckCircle, color: "text-green-600" },
    { label: "Average Score", value: `${values.avgScore}%`, icon: BarChart, color: "text-purple-600" },
    { label: "Pass Rate", value: `${values.passRate}%`, icon: Award, color: "text-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
