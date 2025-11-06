import React from "react";
import { Loader, MessageSquare, Video, AlertCircle, CheckCircle, XCircle, PlayCircle, Clock } from "lucide-react";
import { InterviewCandidate } from "@/services/api/interviewResultsAPI";

function getStatus(c: InterviewCandidate) {
  if (!c) return { text: "Unknown", color: "bg-gray-100 text-gray-800", Icon: AlertCircle };
  if (c.interview_ai_analysis_status === "processing")
    return { text: "Analyzing...", color: "bg-purple-100 text-purple-800", Icon: Clock };

  const hasData =
    c.interview_scheduled ||
    c.interview_started_at ||
    c.interview_completed_at ||
    c.interview_ai_score != null ||
    c.interview_token;

  if (!hasData) return { text: "Not Scheduled", color: "bg-gray-100 text-gray-800", Icon: XCircle };
  if (c.interview_completed_at) {
    if (c.interview_ai_score != null) {
      return c.interview_ai_score >= 70
        ? { text: "Passed", color: "bg-green-100 text-green-800", Icon: CheckCircle }
        : { text: "Failed", color: "bg-red-100 text-red-800", Icon: XCircle };
    }
    return { text: "Pending Analysis", color: "bg-yellow-100 text-yellow-800", Icon: Clock };
  }
  if (c.interview_started_at && !c.interview_completed_at)
    return { text: "In Progress", color: "bg-blue-100 text-blue-800", Icon: PlayCircle };
  if (c.interview_scheduled && !c.interview_started_at)
    return { text: "Scheduled", color: "bg-yellow-100 text-yellow-800", Icon: Clock };

  return { text: "Unknown", color: "bg-gray-100 text-gray-800", Icon: AlertCircle };
}

const CandidatesTable: React.FC<{
  loading: boolean;
  candidates: InterviewCandidate[];
  search: string;
  setSearch: (v: string) => void;
  processingIds: Set<number>;
  liveStatuses: Record<number, any>;
  onOpen: (id: number) => void;
}> = ({ loading, candidates, search, setSearch, processingIds, liveStatuses, onOpen }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Candidates</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {loading && candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <Loader className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                  <p className="mt-2 text-gray-500">Loading…</p>
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <Video className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No interview results found</p>
                </td>
              </tr>
            ) : (
              candidates.map((c) => {
                const st = getStatus(c);
                const busy = processingIds.has(c.id);
                const live = liveStatuses[c.id];

                return (
                  <tr key={c.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        className="text-left font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => onOpen(c.id)}
                      >
                        {c.name}
                      </button>
                      <div className="text-sm text-gray-500">{c.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {c.job_title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                        <st.Icon className="mr-1 h-3 w-3" />
                        {busy ? "Analyzing…" : st.text}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{ width: `${live?.progress ?? c.interview_progress ?? 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {(live?.progress ?? c.interview_progress ?? 0) as number}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {c.interview_ai_score != null ? (
                        <span
                          className={`text-sm font-medium ${
                            (c.interview_ai_score || 0) >= 70 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {Math.round(c.interview_ai_score!)}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        onClick={() => onOpen(c.id)}
                        className="text-blue-600 transition-colors hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidatesTable;
