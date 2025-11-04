// "use client";

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Clock, Navigation, RefreshCw } from "lucide-react";
// import { IR_API, InterviewCandidate } from "@/services/api/interviewResultsAPI";
// import StatsStrip from "./subComponents/StatsStrip";
// import LiveSessions from "./subComponents/LiveSessions";
// import CandidatesTable from "./subComponents/CandidatesTable";
// import CandidateDetailsModal from "./subComponents/CandidateDetailsModal";
// import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
// import {
//   fetchInterviewResults,
//   fetchInterviewStats,
//   submitInterviewFeedback,
//   exportInterviewCsv,
// } from "@/services/redux/thunk/interviewThunk";

// const POLL_MS = 5000;
// const AUTO_REFRESH_MS = 30000;
// const REALTIME_MS = 5000;

// const InterviewResultsInterface: React.FC = () => {
//   const router = useRouter();

//   // data
//   const [loading, setLoading] = useState(false);
//   const [candidates, setCandidates] = useState<InterviewCandidate[]>([]);
//   const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [search, setSearch] = useState("");

//   // live & updates
//   const [liveStatuses, setLiveStatuses] = useState<Record<number, any>>({});
//   const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
//   const retryRef = useRef(0);
//   const pollingRef = useRef<any>(null);
//   const autoRefreshRef = useRef<any>(null);
//   const realtimeRef = useRef<any>(null);

//   // details modal
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [details, setDetails] = useState<any>(null);

//   // ---------- helpers ----------
//   const safeParse = (c: InterviewCandidate | null | undefined): InterviewCandidate | null => {
//     if (!c) return null;
//     return {
//       ...c,
//       interview_ai_score:
//         c.interview_ai_score !== undefined && c.interview_ai_score !== null
//           ? Number(c.interview_ai_score)
//           : null,
//     };
//   };

//   const fetchAll = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     try {
//       const list = await IR_API.getCandidates();
//       const parsed = (list || [])
//         .map(safeParse)
//         .filter(Boolean) as InterviewCandidate[];

//       // track “processing”
//       const pro = new Set<number>();
//       parsed.forEach((x) => {
//         if (x?.interview_ai_analysis_status === "processing") pro.add(x.id);
//       });
//       setProcessingIds(pro);

//       setCandidates(parsed);
//       setLastRefresh(new Date());
//       await IR_API.storeCandidates(parsed);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   }, []);

//   const pollLive = useCallback(async () => {
//     const active = candidates.filter(
//       (c) => c.interview_started_at && !c.interview_completed_at
//     );
//     if (!active.length) return;

//     await Promise.all(
//       active.map(async (c) => {
//         try {
//           const status = await IR_API.getLiveStatus(c.id);
//           setLiveStatuses((prev) => ({ ...prev, [c.id]: status }));
//           await IR_API.updateProgress(c.id, status);
//         } catch (e) {
//           console.warn("live status failed", e);
//         }
//       })
//     );
//   }, [candidates]);

//   const pollUpdates = useCallback(async () => {
//     try {
//       const { updates } = await IR_API.pollUpdates();
//       if (!updates?.length) return;

//       setCandidates((prev) =>
//         prev.map((c) => {
//           const u = updates.find((x: { candidate_id: any; }) => x.candidate_id === c.id);
//           if (!u) return c;
//           const updated = {
//             ...c,
//             interview_ai_score: u.scores?.overall ?? c.interview_ai_score ?? null,
//             interview_ai_technical_score: u.scores?.technical ?? c.interview_ai_technical_score ?? null,
//             interview_ai_communication_score:
//               u.scores?.communication ?? c.interview_ai_communication_score ?? null,
//             interview_ai_problem_solving_score:
//               u.scores?.problem_solving ?? c.interview_ai_problem_solving_score ?? null,
//             interview_ai_cultural_fit_score:
//               u.scores?.cultural_fit ?? c.interview_ai_cultural_fit_score ?? null,
//             interview_ai_analysis_status: "completed",
//           };
//           const next = new Set(processingIds);
//           next.delete(c.id);
//           setProcessingIds(next);
//           return updated;
//         })
//       );
//     } catch (e) {
//       // exponential backoff limiter
//       retryRef.current += 1;
//       if (retryRef.current > 5) {
//         console.warn("poll updates disabled after retries");
//         clearInterval(realtimeRef.current);
//       }
//     }
//   }, [processingIds]);

//   const openDetails = useCallback(async (id: number) => {
//     try {
//       setLoading(true);
//       const [candidate, analysis, qa, progress] = await Promise.all([
//         IR_API.getCandidate(id).catch(() => null),
//         IR_API.getAnalysis(id).catch(() => null),
//         IR_API.getQA(id).catch(() => null),
//         IR_API.getProgress(id).catch(() => null),
//       ]);

//       setDetails({
//         candidate: safeParse(candidate) ?? candidates.find((c) => c.id === id),
//         analysis,
//         qa_data: qa?.qa_data,
//         progress,
//       });
//       setDetailsOpen(true);
//       await IR_API.storeViewHistory(id);
//     } finally {
//       setLoading(false);
//     }
//   }, [candidates]);

//   // ---------- effects ----------
//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   useEffect(() => {
//     if (pollingRef.current) clearInterval(pollingRef.current);
//     pollingRef.current = setInterval(pollLive, POLL_MS);
//     return () => clearInterval(pollingRef.current);
//   }, [pollLive]);

//   useEffect(() => {
//     if (realtimeRef.current) clearInterval(realtimeRef.current);
//     realtimeRef.current = setInterval(pollUpdates, REALTIME_MS * Math.pow(2, Math.min(retryRef.current, 3)));
//     return () => clearInterval(realtimeRef.current);
//   }, [pollUpdates]);

//   useEffect(() => {
//     if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
//     if (autoRefresh) {
//       autoRefreshRef.current = setInterval(() => fetchAll(true), AUTO_REFRESH_MS);
//     }
//     return () => clearInterval(autoRefreshRef.current);
//   }, [autoRefresh, fetchAll]);

//   // ---------- derived ----------
//   const filtered = useMemo(() => {
//     const q = (search || "").toLowerCase();
//     if (!q) return candidates;
//     return candidates.filter(
//       (c) =>
//         c.name?.toLowerCase().includes(q) ||
//         c.email?.toLowerCase().includes(q) ||
//         c.job_title?.toLowerCase().includes(q)
//     );
//   }, [candidates, search]);

//   const stats = useMemo(() => {
//     const total = filtered.length;
//     const completed = filtered.filter((c) => c.interview_completed_at).length;
//     const inProgress = filtered.filter((c) => c.interview_started_at && !c.interview_completed_at).length;
//     const withScore = filtered.filter((c) => c.interview_ai_score !== null);
//     const avg =
//       withScore.reduce((s, c) => s + (c.interview_ai_score || 0), 0) / (withScore.length || 1);
//     const pass =
//       (withScore.filter((c) => (c.interview_ai_score || 0) >= 70).length / (withScore.length || 1)) *
//       100;
//     const pending = filtered.filter((c) => c.interview_completed_at && c.interview_ai_score == null)
//       .length;
//     return { total, completed, inProgress, avg, pass, pending };
//   }, [filtered]);

//   // ---------- UI ----------
//   return (
//     <div className="flex min-h-screen flex-col bg-gray-50">
//       <Navigation />

//       <main className="flex-1 p-6">
//         {/* header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
//             <p className="mt-1 text-gray-600">Click a candidate to view detailed analysis</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center text-sm text-gray-500">
//               <Clock className="mr-1 h-4 w-4" />
//               Last updated: {lastRefresh.toLocaleTimeString()}
//             </div>
//             <button
//               onClick={() => fetchAll()}
//               disabled={loading}
//               className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100"
//             >
//               <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//               Refresh
//             </button>
//             <label className="flex cursor-pointer items-center text-sm text-gray-600">
//               <input
//                 type="checkbox"
//                 className="mr-2"
//                 checked={autoRefresh}
//                 onChange={(e) => setAutoRefresh(e.target.checked)}
//               />
//               Auto-refresh
//             </label>
//           </div>
//         </div>

//         {/* top stats */}
//         <StatsStrip
//           total={stats.total}
//           inProgress={stats.inProgress}
//           completed={stats.completed}
//           avgScore={Number.isFinite(stats.avg) ? stats.avg : 0}
//           passRate={Number.isFinite(stats.pass) ? stats.pass : 0}
//           pending={stats.pending}
//         />

//         {/* live blocks */}
//         {Object.keys(liveStatuses).length > 0 && (
//           <LiveSessions
//             candidates={candidates}
//             liveStatuses={liveStatuses}
//             onOpen={openDetails}
//           />
//         )}

//         {/* table */}
//         <CandidatesTable
//           loading={loading && candidates.length === 0}
//           candidates={filtered}
//           search={search}
//           setSearch={setSearch}
//           processingIds={processingIds}
//           liveStatuses={liveStatuses}
//           onOpen={openDetails}
//         />
//       </main>

//       {detailsOpen && details && (
//         <CandidateDetailsModal details={details} onClose={() => setDetailsOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default InterviewResultsInterface;

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, RefreshCw } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
// ⬇️ If your navbar is elsewhere, change this import:
// import Navigation from "@/components/navbar/Navbar";

import StatsStrip from "./subComponents/StatsStrip";
import LiveSessions from "./subComponents/LiveSessions";
import CandidatesTable from "./subComponents/CandidatesTable";

import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";
import {
  fetchInterviewResults,
  fetchInterviewStats,
  submitInterviewFeedback,
  exportInterviewCsv,
} from "@/services/redux/thunk/interviewThunk";
import type { InterviewResult } from "@/services/interfaces/interview.interface";

const POLL_MS = 5000;
const AUTO_REFRESH_MS = 30000;
const REALTIME_MS = 5000;

const InterviewResultsInterface: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ----- Redux state (slice: interview) -----
  const { results, stats, loading, exporting, lastCsv, error } = useAppSelector(
    (s) => s.interview
  );

  // ----- Local UI state -----
  const [mounted, setMounted] = useState(false); // for hydration-safe clock
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [search, setSearch] = useState("");

  // “live” demo state you had earlier
  const [liveStatuses] = useState<Record<number, any>>({});
  const [processingIds] = useState<Set<number>>(new Set());
  const retryRef = useRef(0);
  const pollingRef = useRef<any>(null);
  const autoRefreshRef = useRef<any>(null);
  const realtimeRef = useRef<any>(null);

  // ---------- lifecycle ----------
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const refreshAll = useCallback(
    async (silent = false) => {
      if (!silent) {
        // let the slice drive the main loading; no local spinner needed
      }
      // load both stats and results
      await Promise.all([
        dispatch(fetchInterviewStats({})).unwrap().catch(() => {}),
        dispatch(fetchInterviewResults({ page: 1, page_size: 200 })).unwrap().catch(() => {}),
      ]);
      setLastRefresh(new Date());
    },
    [dispatch]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAll();
  }, [refreshAll]);

  // ---------- effects: timers ----------
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      // you can compute “active” candidates from results
      const active = results.filter(
        (c) => c.completed_at == null && c.scheduled_at != null
      );
      if (!active.length) return;
      // If you later add a live-status API thunk, dispatch it here and update local state.
      // setLiveStatuses((prev) => ({ ...prev, ...incoming }));
    }, POLL_MS);
    return () => clearInterval(pollingRef.current);
  }, [results]);

  useEffect(() => {
    if (realtimeRef.current) clearInterval(realtimeRef.current);
    realtimeRef.current = setInterval(() => {
      // place to dispatch a “poll updates” thunk if you add one
      // implement backoff via retryRef if needed
    }, REALTIME_MS * Math.pow(2, Math.min(retryRef.current, 3)));
    return () => clearInterval(realtimeRef.current);
  }, []);

  useEffect(() => {
    if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    if (autoRefresh) {
      autoRefreshRef.current = setInterval(() => refreshAll(true), AUTO_REFRESH_MS);
    }
    return () => clearInterval(autoRefreshRef.current);
  }, [autoRefresh, refreshAll]);

  // ---------- derived ----------
  const filtered: InterviewResult[] = useMemo(() => {
    const q = (search || "").toLowerCase();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.candidate_name?.toLowerCase().includes(q) ||
        r.job_title?.toLowerCase().includes(q) ||
        String(r.id).includes(q)
    );
  }, [results, search]);

  const top = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((c) => c.completed_at).length;
    const inProgress = filtered.filter((c) => !c.completed_at && c.scheduled_at).length;
    const withScore = filtered.filter((c) => Number.isFinite(c.score));
    const avg = withScore.reduce((s, c) => s + (c.score || 0), 0) / (withScore.length || 1);
    const pass =
      (withScore.filter((c) => (c.score || 0) >= 70).length / (withScore.length || 1)) * 100;
    const pending = filtered.filter((c) => c.completed_at && !Number.isFinite(c.score)).length;
    return { total, completed, inProgress, avg, pass, pending };
  }, [filtered]);

  // ---------- actions ----------
  const handleExport = () => dispatch(exportInterviewCsv({}));

  const handleFeedback = async (resultId: number) => {
    const notes = prompt("Add feedback notes:");
    if (!notes) return;
    await dispatch(
      submitInterviewFeedback({
        result_id: resultId,
        feedback: { interviewer: "You", score: 0, notes },
      })
    ).unwrap();
    refreshAll(true);
  };

  // download CSV when slice provides blob
  useEffect(() => {
    if (!lastCsv) return;
    const url = URL.createObjectURL(lastCsv);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [lastCsv]);

  // ---------- UI ----------
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 p-6">
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
            <p className="mt-1 text-gray-600">Click a candidate to view detailed analysis</p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex items-center gap-3">
            {/* Hydration-safe clock */}
            {mounted && lastRefresh && (
              <div className="flex items-center text-sm text-gray-500" suppressHydrationWarning>
                <Clock className="mr-1 h-4 w-4" />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={() => refreshAll()}
              disabled={loading}
              className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 disabled:opacity-60"
            >
              <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <label className="flex cursor-pointer items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh
            </label>
          </div>
        </div>

        {/* top stats */}
        <StatsStrip
          total={top.total}
          inProgress={top.inProgress}
          completed={top.completed}
          avgScore={Number.isFinite(top.avg) ? top.avg : 0}
          passRate={Number.isFinite(top.pass) ? top.pass : 0}
          pending={top.pending}
        />

        {/* optional live sessions (kept for UI parity) */}
        {Object.keys(liveStatuses).length > 0 && (
          <LiveSessions candidates={results as any} liveStatuses={liveStatuses} onOpen={() => {}} />
        )}

        {/* table */}
        <CandidatesTable
          loading={loading && results.length === 0}
          candidates={filtered as any}
          search={search}
          setSearch={setSearch}
          processingIds={processingIds}
          liveStatuses={liveStatuses}
          onOpen={(id) => handleFeedback(id)} // or open a details modal if you have one
          onExport={handleExport}
          exporting={exporting}
        />
      </main>
    </div>
  );
};

export default InterviewResultsInterface;
