import React from "react";

const CandidateListSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10 flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="h-6 w-12 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateListSkeleton;