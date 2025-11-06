import React from "react";

type Candidate = {
  id: number;
  name: string;
  email: string;
  exam_percentage?: number;
  exam_completed_date?: string | null;
  final_status?: string | null;
  exam_feedback?: string | null;
};

const RecentCompletions: React.FC<{ items: Candidate[] }> = ({ items }) => {
  return (
    <div>
      <h4 className="font-medium mb-3">Recent Completions ({items.length})</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed assessments yet</p>
        ) : (
          items.map((c) => (
            <div key={c.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (c.exam_percentage || 0) >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {Math.round(c.exam_percentage || 0)}%
                    </span>
                    <span className="text-xs text-gray-400">
                      {c.exam_completed_date ? new Date(c.exam_completed_date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{c.final_status || "Processing..."}</p>
                  {c.exam_feedback && (
                    <p className="text-xs text-gray-500 mt-1 max-w-32 truncate">{c.exam_feedback}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentCompletions;
