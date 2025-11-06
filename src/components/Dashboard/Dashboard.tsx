// src/components/Dashboard.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Use the typed hooks (no direct useDispatch/useSelector here)
import { useAppDispatch, useAppSelector } from "@/services/redux/hooks";

import { RefreshCw, Users, Target, Clock, Bell, AlertCircle} from "lucide-react";

import StatCard from "./subComponents/StatCard";
import PipelineRunner from "./subComponents/PipelineRunner";
import Navbar from "@/components/navbar/Navbar";

import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

import { dashboardRefreshAll } from "@/services/redux/thunk/dashboardThunk";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // --- Redux state (from dashboardSlice) ---
  const { jobs, candidates, recruitmentData, loading } = useAppSelector(
    (state) => state.dashboard
  );

  // --- Local UI state ---
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPipelineJob, setSelectedPipelineJob] = useState<any | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<"week" | "month" | "quarter" | "year">("month");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<Record<string, any>>({});
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // ---- Fetch everything the dashboard needs ----
  const fetchAll = useCallback(
    async (force = false) => {
      if (force) setRefreshing(true);
      try {
        await dispatch(dashboardRefreshAll()).unwrap();
        setLastFetchTime(new Date());
      } finally {
        setRefreshing(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchAll();
    const id = setInterval(() => fetchAll(true), 120000);
    return () => clearInterval(id);
  }, [fetchAll, selectedTimeRange]);

  // ---- Derived stats (memoized) ----
  const stats = useMemo(() => {
    const total = candidates.length;
    const shortlisted = candidates.filter((c: { status: string }) => c?.status === "Shortlisted").length;
    const interviews = candidates.filter((c: { interview_scheduled: any }) => c?.interview_scheduled).length;
    const assessmentsSent = candidates.filter((c: { exam_link_sent: any }) => c?.exam_link_sent).length;
    const assessmentsCompleted = candidates.filter((c: { exam_completed: any }) => c?.exam_completed).length;
    const hires = candidates.filter((c: { final_status: string }) => c?.final_status === "Hired").length;
    const pendingAssessments = candidates.filter(
      (c) => c?.exam_link_sent && !c?.exam_completed && !c?.link_expired
    ).length;

    const now = new Date();
    const pendingInterviews = candidates.filter((c: { interview_date: string | number | Date; interview_scheduled: any }) => {
      if (!c?.interview_date) return false;
      return c?.interview_scheduled && new Date(c.interview_date) > now;
    }).length;

    const timeToHire = (() => {
      const hired = candidates.filter((c: { final_status: string; processed_date: any }) => c?.final_status === "Hired" && c?.processed_date);
      if (!hired.length) return 0;
      const totalDays = hired.reduce((acc: number, c: { processed_date: string | number | Date }) => {
        const start = new Date(c.processed_date).getTime();
        const days = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
        return acc + Math.max(days, 0);
      }, 0);
      return Math.round(totalDays / hired.length);
    })();

    return {
      totalApplications: total,
      activeInterviews: interviews,
      timeToHire,
      activeAssessments: pendingAssessments,
      shortlistRate: total > 0 ? ((shortlisted / total) * 100).toFixed(1) : 0,
      assessmentCompletionRate:
        assessmentsSent > 0 ? ((assessmentsCompleted / assessmentsSent) * 100).toFixed(1) : 0,
      totalHires: hires,
      pendingActions: pendingAssessments + pendingInterviews,
    };
  }, [candidates]);

  // ---- Notifications from state changes ----
  useEffect(() => {
    const outs: any[] = [];
    const pendingAssessments = candidates.filter(
      (c: { exam_link_sent: any; exam_completed: any; link_expired: any }) =>
        c?.exam_link_sent && !c?.exam_completed && !c?.link_expired
    );
    if (pendingAssessments.length) {
      outs.push({
        id: 1,
        type: "warning",
        message: `${pendingAssessments.length} candidates have pending assessments`,
        action: "View Candidates",
        route: "/candidates",
      });
    }
    const upcomingToday = candidates.filter((c: { interview_date: string | number | Date }) => {
      if (!c?.interview_date) return false;
      const diffHrs = (new Date(c.interview_date).getTime() - Date.now()) / (1000 * 60 * 60);
      return diffHrs > 0 && diffHrs < 24;
    });
    if (upcomingToday.length) {
      outs.push({
        id: 2,
        type: "info",
        message: `${upcomingToday.length} interviews scheduled for today`,
        action: "View Schedule",
        route: "/scheduler",
      });
    }
    setNotifications(outs);
  }, [candidates]);

  // ---- Charts data ----
  const pipelineStages = useMemo(
    () => [
      { name: "Applied", value: candidates.length, color: "#3B82F6" },
      { name: "Screened", value: candidates.filter((c: { ats_score: number }) => c?.ats_score > 0).length, color: "#10B981" },
      { name: "Shortlisted", value: candidates.filter((c: { status: string }) => c?.status === "Shortlisted").length, color: "#F59E0B" },
      { name: "Assessment", value: candidates.filter((c: { exam_completed: any }) => c?.exam_completed).length, color: "#8B5CF6" },
      { name: "Interview", value: candidates.filter((c: { interview_scheduled: any }) => c?.interview_scheduled).length, color: "#EF4444" },
      { name: "Hired", value: candidates.filter((c: { final_status: string }) => c?.final_status === "Hired").length, color: "#059669" },
    ],
    [candidates]
  );

  const assessmentMetrics = useMemo(
    () => [
      { name: "Sent", value: candidates.filter((c: { exam_link_sent: any }) => c?.exam_link_sent).length },
      { name: "Started", value: candidates.filter((c: { exam_started: any }) => c?.exam_started).length },
      { name: "Completed", value: candidates.filter((c: { exam_completed: any }) => c?.exam_completed).length },
      { name: "Passed", value: candidates.filter((c: { exam_percentage: number }) => c?.exam_percentage >= 70).length },
    ],
    [candidates]
  );

  // ---- Handlers ----
  const handleRefresh = useCallback(() => fetchAll(true), [fetchAll]);

  // First-load placeholder
  if (loading && !lastFetchTime) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <Navbar />

      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
            <div className="flex items-center mt-1 space-x-4">
              <p className="text-gray-600">Welcome back! Here&apos;s your recruitment overview</p>
              {lastFetchTime && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastFetchTime.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 border border-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-500"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="border rounded-lg px-4 py-2 text-sm text-gray-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={() => jobs.length > 0 && setSelectedPipelineJob(jobs[0])}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              New Pipeline
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  n.type === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center">
                  <AlertCircle
                    className={`w-5 h-5 mr-3 ${n.type === "warning" ? "text-yellow-600" : "text-blue-600"}`}
                  />
                  <span className={n.type === "warning" ? "text-yellow-800" : "text-blue-800"}>
                    {n.message}
                  </span>
                </div>
                <button
                  onClick={() => router.push(n.route)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    n.type === "warning"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {n.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            change={12.5}
            icon={Users}
            color="bg-blue-600"
            subtitle="All time applications"
            loading={loading}
          />
          <StatCard
            title="Shortlist Rate"
            value={`${stats.shortlistRate}%`}
            change={5.2}
            icon={Target}
            color="bg-green-600"
            subtitle="Candidates shortlisted"
            loading={loading}
          />
          <StatCard
            title="Time-to-Hire"
            value={`${stats.timeToHire}d`}
            change={-8.3}
            icon={Clock}
            color="bg-yellow-600"
            subtitle="Average days to hire"
            loading={loading}
          />
          <StatCard
            title="Pending Actions"
            value={stats.pendingActions}
            icon={Bell}
            color="bg-purple-600"
            subtitle="Requires attention"
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Recruitment Pipeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineStages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6">
                  {pipelineStages.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Recruitment Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recruitmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" /> {/* change to "month" if your API provides that */}
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="hires" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Active Job Positions</h3>
            <button
              onClick={() => router.push("/candidates")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Candidates →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Applications</th>
                  <th className="px-6 py-3">Shortlisted</th>
                  <th className="px-6 py-3">In Progress</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No job positions found</p>
                      <p className="mt-1">Start a new recruitment pipeline to begin</p>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: any) => {
                    const jobCandidates = candidates.filter((c: { job_id: any }) => c?.job_id === job.id);
                    const shortlisted = jobCandidates.filter((c: { status: string }) => c?.status === "Shortlisted").length;
                    const inProgress = jobCandidates.filter(
                      (c: { exam_link_sent: any; interview_scheduled: any }) => c?.exam_link_sent || c?.interview_scheduled
                    ).length;

                    return (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.location}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {jobCandidates.length}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-green-600">{shortlisted}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-blue-600">{inProgress}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/candidates?job_id=${job.id}`)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setSelectedPipelineJob(job)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Run Pipeline
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment metrics + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Assessment Metrics</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={assessmentMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Completion Rate</p>
                <p className="text-xl font-semibold text-gray-500">{stats.assessmentCompletionRate}%</p>
              </div>
              <div>
                <p className="text-gray-500">Pass Rate</p>
                <p className="text-xl font-semibold text-gray-500">
                  {candidates.filter((c: { exam_completed: any }) => c?.exam_completed).length > 0
                    ? (
                        (candidates.filter((c: { exam_percentage: number }) => c?.exam_percentage >= 70).length /
                          candidates.filter((c: { exam_completed: any }) => c?.exam_completed).length) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/assessments")}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="font-medium text-gray-700">Manage Assessments</span>
                <span className="text-sm text-gray-500">{stats.activeAssessments} pending</span>
              </button>

              <button
                onClick={() => router.push("/scheduler")}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="font-medium text-gray-700">Schedule Interviews</span>
                <span className="text-sm text-gray-500">{stats.activeInterviews} scheduled</span>
              </button>

              <button
                onClick={() => jobs.length > 0 && setSelectedPipelineJob(jobs[0])}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="font-medium text-gray-700">Start New Recruitment</span>
                <span className="text-sm text-gray-500">Run pipeline</span>
              </button>

              <button
                onClick={() => router.push("/candidates")}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="font-medium text-gray-700">View All Candidates</span>
                <span className="text-sm text-gray-500">{candidates.length} total</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedPipelineJob && (
        <PipelineRunner
          job={selectedPipelineJob}
          onPipelineStart={() =>
            setPipelineStatus((p) => ({
              ...p,
              [selectedPipelineJob.id]: { status: "running", message: "Pipeline running..." },
            }))
          }
          onPipelineComplete={() => {
            fetchAll(true);
            setPipelineStatus((p) => ({
              ...p,
              [selectedPipelineJob.id]: { status: "completed", message: "Pipeline completed!" },
            }));
          }}
          onClose={() => setSelectedPipelineJob(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
