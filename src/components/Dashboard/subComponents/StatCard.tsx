import React from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string; // e.g. "bg-blue-600"
  subtitle?: string;
  loading?: boolean;
};

const StatCard: React.FC<Props> = ({ title, value, change, icon: Icon, color, subtitle, loading }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="flex items-baseline">
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      {change !== undefined && !loading && (
        <span className={`ml-2 text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      )}
    </div>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

export default StatCard;
