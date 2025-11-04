import React, { useMemo, useState } from "react";
import { X, Mail, Phone, MapPin, Video, FileText, CheckCircle, ChevronRight, Clock, BarChart, MessageSquare } from "lucide-react";
import {
  ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis, BarChart as ReBar, Bar,
  RadialBarChart, RadialBar
} from "recharts";

const formatDuration = (seconds?: number) => {
  const s = Number.isFinite(seconds as number) ? Number(seconds) : 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}h ${m}m ${sec}s` : m ? `${m}m ${sec}s` : `${sec}s`;
};

const CandidateDetailsModal: React.FC<{
  details: any; // { candidate, analysis, qa_data, progress }
  onClose: () => void;
}> = ({ details, onClose }) => {
  const [tab, setTab] = useState<"overview" | "analysis" | "qa" | "progress">("overview");
  const c = details?.candidate;

  const skillsData = useMemo(
    () => [
      { skill: "Technical", score: c?.interview_ai_technical_score || 0 },
      { skill: "Communication", score: c?.interview_ai_communication_score || 0 },
      { skill: "Problem Solving", score: c?.interview_ai_problem_solving_score || 0 },
      { skill: "Cultural Fit", score: c?.interview_ai_cultural_fit_score || 0 },
    ],
    [c]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white">
        {/* header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">{c?.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {c?.email && (
                  <span className="flex items-center">
                    <Mail className="mr-1 h-4 w-4" /> {c.email}
                  </span>
                )}
                {c?.phone && (
                  <span className="flex items-center">
                    <Phone className="mr-1 h-4 w-4" /> {c.phone}
                  </span>
                )}
                {c?.location && (
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" /> {c.location}
                  </span>
                )}
              </div>
              {c?.job_title && <div className="mt-2 rounded-full bg-white/20 px-3 py-1 text-sm">{c.job_title}</div>}
            </div>
            <button onClick={onClose} className="text-white/80 transition-colors hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex gap-1 p-1">
            {(["overview", "analysis", "qa", "progress"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
                  tab === t ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="max-h-[calc(95vh-280px)] overflow-y-auto p-6">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-white p-4">
                  <p className="mb-1 text-sm text-gray-600">Interview Status</p>
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {c?.interview_completed_at
                      ? "Completed"
                      : c?.interview_started_at
                      ? "In Progress"
                      : c?.interview_scheduled
                      ? "Scheduled"
                      : "Not Scheduled"}
                  </span>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="mb-1 text-sm text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold">{c?.interview_ai_score != null ? `${Math.round(c.interview_ai_score)}%` : "—"}</p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="mb-1 text-sm text-gray-600">Questions Answered</p>
                  <p className="text-2xl font-bold">
                    {c?.interview_questions_answered}/{c?.interview_total_questions ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <p className="mb-1 text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold">{formatDuration(c?.interview_duration)}</p>
                </div>
              </div>

              {c?.interview_ai_score != null && (
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold">Skills Assessment</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBar data={skillsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </ReBar>
                  </ResponsiveContainer>
                </div>
              )}

              {(c?.strengths?.length || c?.weaknesses?.length) && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {c?.strengths?.length ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                      <h3 className="mb-3 text-lg font-semibold text-green-800">Strengths</h3>
                      <ul className="space-y-2">
                        {c.strengths!.map((s: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
                            <span className="text-gray-700">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {c?.weaknesses?.length ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                      <h3 className="mb-3 text-lg font-semibold text-red-800">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {c.weaknesses!.map((w: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="mr-2 mt-0.5 h-5 w-5 text-red-600" />
                            <span className="text-gray-700">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {tab === "analysis" && (
            <div className="space-y-6">
              {c?.interview_ai_overall_feedback || details?.analysis?.overall_feedback ? (
                <>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                    <h3 className="mb-3 text-lg font-semibold text-blue-800">AI Analysis</h3>
                    <p className="whitespace-pre-line text-gray-700">
                      {c?.interview_ai_overall_feedback || details?.analysis?.overall_feedback}
                    </p>
                  </div>

                  {(c?.recommendations?.length || details?.analysis?.recommendations?.length) && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                      <h3 className="mb-3 text-lg font-semibold text-yellow-800">Recommendations</h3>
                      <ul className="space-y-2">
                        {(c?.recommendations || details?.analysis?.recommendations || []).map(
                          (r: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <ChevronRight className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                              <span className="text-gray-700">{r}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-4 ${
                      (c?.interview_ai_score ?? 0) >= 70
                        ? "border border-green-200 bg-green-50"
                        : "border border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="text-lg font-semibold">
                      Final Decision:{" "}
                      {details?.analysis?.final_status ??
                        ((c?.interview_ai_score ?? 0) >= 70 ? "Recommended" : "Not Recommended")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <BarChart className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No analysis available yet</p>
                </div>
              )}
            </div>
          )}

          {tab === "qa" && (
            <div className="space-y-4">
              {details?.qa_data?.qa_pairs?.length ? (
                details.qa_data.qa_pairs.map((qa: any, i: number) => (
                  <div key={i} className="rounded-lg border bg-white p-4">
                    <p className="mb-2 font-semibold text-blue-700">Question {i + 1}:</p>
                    <p className="text-gray-800">{qa.question}</p>
                    <p className="mt-3 font-semibold text-green-700">Answer:</p>
                    <p className="text-gray-800">
                      {qa.answer || <span className="italic text-red-500">No answer provided</span>}
                    </p>
                    {qa.score != null && (
                      <p className="mt-2 text-sm text-gray-600">Score: {qa.score}/10</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No Q&A data available</p>
                </div>
              )}
            </div>
          )}

          {tab === "progress" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold">Interview Progress</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ name: "Progress", value: c?.interview_progress || 0, fill: "#3B82F6" }]}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                      {Math.round(c?.interview_progress || 0)}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold">Interview Timeline</h3>
                <div className="space-y-3 text-sm">
                  {c?.interview_scheduled && (
                    <div>• Scheduled: {c.interview_date ? new Date(c.interview_date).toLocaleString() : "—"}</div>
                  )}
                  {c?.interview_started_at && <div>• Started: {new Date(c.interview_started_at).toLocaleString()}</div>}
                  {c?.interview_completed_at && <div>• Completed: {new Date(c.interview_completed_at).toLocaleString()}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {c?.interview_recording_url && (
                <a
                  href={c.interview_recording_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                >
                  <Video className="mr-2 inline h-4 w-4" />
                  View Recording
                </a>
              )}
              {c?.resume_url && (
                <a
                  href={c.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <FileText className="mr-2 inline h-4 w-4" />
                  View Resume
                </a>
              )}
            </div>
            <button onClick={onClose} className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
