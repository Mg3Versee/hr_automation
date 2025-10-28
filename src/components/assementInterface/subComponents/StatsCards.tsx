import React from "react";
import { Send, CheckCircle, BarChart, Award } from "lucide-react";
import { Job } from "../AssessmentInterface";

interface StatsCardsProps {
  selectedJob: Job;
}

const StatsCards: React.FC<StatsCardsProps> = ({ selectedJob }) => {
  const stats = {
    totalSent: 10,
    totalCompleted: 6,
    avgScore: 82.5,
    passRate: 70,
  };

  const cards = [
    { label: "Total Sent", value: stats.totalSent, icon: Send, color: "text-blue-600" },
    { label: "Completed", value: stats.totalCompleted, icon: CheckCircle, color: "text-green-600" },
    { label: "Average Score", value: `${stats.avgScore}%`, icon: BarChart, color: "text-purple-600" },
    { label: "Pass Rate", value: `${stats.passRate}%`, icon: Award, color: "text-yellow-600" },
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
