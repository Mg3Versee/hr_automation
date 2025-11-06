import React from "react";
import { Candidate } from "@/services/interfaces/CandidateScreening";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isSelected, onClick }) => {
  const StatusIcon = candidate.statusInfo?.icon;
  const daysSinceProcessed = candidate?.processed_date
    ? Math.floor((Date.now() - new Date(candidate.processed_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div
      className={`p-4 cursor-pointer transition-all border-l-4 ${
        isSelected
          ? "bg-blue-50 border-blue-500 shadow-md"
          : "hover:bg-gray-50 border-transparent hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
            {candidate.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{candidate.name}</h3>
            <p className="text-sm text-gray-500 truncate">{candidate.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {candidate.job_title} • Applied {daysSinceProcessed}d ago
            </p>
          </div>
        </div>

        {/* Score and Status */}
        <div className="flex flex-col items-end ml-4">
          <div className="flex items-center space-x-1 mb-2">
            <span className={`text-lg font-bold ${candidate.scoreColor}`}>
              {(candidate.displayScore ?? 0).toFixed(0)}
            </span>
            <span className="text-sm text-gray-500">/100</span>
          </div>

          {StatusIcon && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${candidate.statusInfo?.color}`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {candidate.displayStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CandidateCard);