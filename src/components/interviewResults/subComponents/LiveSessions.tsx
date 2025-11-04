import React from "react";
import { Activity, CircleDot } from "lucide-react";
import { InterviewCandidate } from "@/services/api/interviewResultsAPI";

const LiveSessions: React.FC<{
  candidates: InterviewCandidate[];
  liveStatuses: Record<number, any>;
  onOpen: (id: number) => void;
}> = ({ candidates, liveStatuses, onOpen }) => {
  const live = candidates.filter((c) => c && liveStatuses[c.id]);

  if (!live.length) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 flex items-center text-lg font-semibold">
        <Activity className="mr-2 h-5 w-5 text-blue-600" />
        Live Interview Sessions
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {live.map((c) => {
          const s = liveStatuses[c.id];
          return (
            <div key={c.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <button
                    className="font-semibold text-gray-900 hover:text-blue-600"
                    onClick={() => onOpen(c.id)}
                  >
                    {c.name}
                  </button>
                  <p className="text-sm text-gray-600">{c.job_title}</p>
                </div>
                <CircleDot className={`h-4 w-4 ${s.is_active ? "text-green-600 animate-pulse" : "text-gray-400"}`} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{(s.progress ?? 0).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${s.progress ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveSessions;
