import React from "react";
import { Users, PlayCircle, CheckCircle, Target, Award, Clock } from "lucide-react";

const Card: React.FC<{ title: string; value: React.ReactNode; icon: any }> = ({ title, value, icon: Icon }) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-600" />
    </div>
  </div>
);

const StatsStrip: React.FC<{
  total: number;
  inProgress: number;
  completed: number;
  avgScore: number;
  passRate: number;
  pending: number;
}> = ({ total, inProgress, completed, avgScore, passRate, pending }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-6">
      <Card title="Total" value={total} icon={Users} />
      <Card title="In Progress" value={inProgress} icon={PlayCircle} />
      <Card title="Completed" value={completed} icon={CheckCircle} />
      <Card title="Avg Score" value={`${avgScore.toFixed(1)}%`} icon={Target} />
      <Card title="Pass Rate" value={`${passRate.toFixed(1)}%`} icon={Award} />
      <Card title="Pending" value={pending} icon={Clock} />
    </div>
  );
};

export default StatsStrip;
