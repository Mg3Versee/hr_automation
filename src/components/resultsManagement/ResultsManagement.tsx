"use client";

import React, { useMemo, useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle, Users, Settings, Target, TrendingUp, Clock, Eye } from "lucide-react";
import { scrapeAssessment, scrapeAllPending, manualProcessCandidate } from "@/services/api/assessmentAPI";
import QuickStats from "./subComponents/QuickStats";
import PendingList from "./subComponents/PendingList";
import RecentCompletions from "./subComponents/RecentCompletions";
import ManualProcessModal from "./subComponents/ManualProcessModal";


type Job = { title: string } | null;

type Props = {
  selectedJob: Job;
  candidates: Candidate[];
  onRefreshCandidates: () => void;
};

const ResultsManagement: React.FC<Props> = ({ selectedJob, candidates, onRefreshCandidates }) => {
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCandidate, setManualCandidate] = useState<Candidate | null>(null);

  // --- derive: pending / recent ---
  const pending = useMemo(
    () =>
      candidates.filter(
        (c) => c.exam_link_sent && !c.exam_completed && !c.link_expired && c.assessment_invite_link
      ),
    [candidates]
  );

  const recent = useMemo(() => {
    const done = candidates.filter((c) => c.exam_completed);
    return done
      .slice()
      .sort(
        (a, b) =>
          (new Date(b.exam_completed_date || 0).getTime() || 0) -
          (new Date(a.exam_completed_date || 0).getTime() || 0)
      )
      .slice(0, 5);
  }, [candidates]);

  const metrics = useMemo(() => {
    const completed = candidates.filter((c) => c.exam_completed);
    const passed = completed.filter((c) => (c.exam_percentage || 0) >= 70);
    const avg =
      completed.length > 0
        ? (completed.reduce((s, c) => s + (c.exam_percentage || 0), 0) / completed.length).toFixed(1)
        : "0";
    return {
      pending: pending.length,
      completed: completed.length,
      passed: passed.length,
      passRate: completed.length ? ((passed.length / completed.length) * 100).toFixed(1) : "0",
      avgScore: avg,
    };
  }, [candidates, pending]);

  // --- actions ---
  const doScrapeOne = async () => {
    if (!selectedJob?.title) {
      setStatusMsg("❌ Please select a job first");
      return;
    }
    setBusy(true);
    setStatusMsg(`🔍 Scraping results for "${selectedJob.title}"...`);
    try {
      const res = await scrapeAssessment(selectedJob.title);
      setStatusMsg(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
      if (res.success) setTimeout(onRefreshCandidates, 3000);
    } catch (e: any) {
      setStatusMsg(`❌ ${e?.message || "Network error"}`);
    } finally {
      setBusy(false);
      setTimeout(() => setStatusMsg(""), 10000);
    }
  };

  const doScrapeAll = async () => {
    setBusy(true);
    setStatusMsg("🔍 Scraping all pending assessments...");
    try {
      const res = await scrapeAllPending();
      setStatusMsg(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
      if (res.success) setTimeout(onRefreshCandidates, 5000);
    } catch (e: any) {
      setStatusMsg(`❌ ${e?.message || "Network error"}`);
    } finally {
      setBusy(false);
      setTimeout(() => setStatusMsg(""), 15000);
    }
  };

  const handleManualSubmit = async (score: number, total: number) => {
    if (!manualCandidate) return;
    try {
      const res = await manualProcessCandidate({
        candidate_email: manualCandidate.email,
        exam_score: score,
        total_questions: total,
        time_taken: 0,
      });
      setStatusMsg(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
      setManualOpen(false);
      if (res.success) onRefreshCandidates();
    } catch (e: any) {
      setStatusMsg(`❌ ${e?.message || "Network error"}`);
    }
  };

  // --- UI ---
  return (
    <div className="space-y-6">
      {/* status strip */}
      {statusMsg && (
        <div
          className={`p-4 rounded-lg border flex items-center ${
            statusMsg.includes("❌")
              ? "bg-red-50 border-red-200 text-red-700"
              : statusMsg.includes("✅")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <div className="flex items-center">
            {statusMsg.includes("🔍") && <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
            {statusMsg.includes("✅") && <CheckCircle className="w-5 h-5 mr-2" />}
            {statusMsg.includes("❌") && <AlertCircle className="w-5 h-5 mr-2" />}
            <span>{statusMsg}</span>
          </div>
        </div>
      )}

      {/* quick stats */}
      <QuickStats
        items={[
          { label: "Pending Results", value: metrics.pending, Icon: Clock, tone: "orange" },
          { label: "Completed", value: metrics.completed, Icon: CheckCircle, tone: "green" },
          { label: "Pass Rate", value: `${metrics.passRate}%`, Icon: Target, tone: "blue" },
          { label: "Avg Score", value: `${metrics.avgScore}%`, Icon: TrendingUp, tone: "purple" },
        ]}
      />

      {/* actions panel */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Results Management</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={doScrapeOne}
              disabled={!selectedJob || busy}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              title="Check results for the selected job"
            >
              <Eye className="w-4 h-4 mr-2" />
              {busy ? "Scraping..." : "Check Results"}
            </button>

            <button
              onClick={doScrapeAll}
              disabled={busy || pending.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              title="Check all pending assessments"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${busy ? "animate-spin" : ""}`} />
              Check All Pending
            </button>
          </div>
        </div>

        {!selectedJob ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Select a job position to manage assessment results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingList
              items={pending}
              onManual={(c) => {
                setManualCandidate(c);
                setManualOpen(true);
              }}
            />
            <RecentCompletions items={recent} />
          </div>
        )}
      </div>

      {/* Automation (kept visual; no backend wiring) */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Automation Settings
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Auto-Check Results</p>
              <p className="text-sm text-gray-500">Automatically check for new results</p>
            </div>
            {/* placeholder toggle (no API) */}
            <div className="w-11 h-6 bg-gray-200 rounded-full relative">
              <div className="absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full" />
            </div>
          </div>
          <div className="p-3 border rounded">
            <label className="block font-medium mb-2">Check Interval</label>
            <select className="w-full border rounded px-3 py-2 text-sm" defaultValue="30">
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
              <option value="120">Every 2 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Auto-Process</p>
              <p className="text-sm text-gray-500">Send emails automatically</p>
            </div>
            {/* placeholder toggle (no API) */}
            <div className="w-11 h-6 bg-gray-200 rounded-full relative">
              <div className="absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {manualOpen && manualCandidate && (
        <ManualProcessModal
          candidate={manualCandidate}
          onClose={() => setManualOpen(false)}
          onSubmit={handleManualSubmit}
        />
      )}
    </div>
  );
};

export default ResultsManagement;
