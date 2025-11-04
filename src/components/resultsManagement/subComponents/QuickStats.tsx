import React from "react";

type Item = {
  label: string;
  value: number | string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "orange" | "green" | "blue" | "purple";
};

const toneMap: Record<Item["tone"], string> = {
  orange: "text-orange-600",
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
};

const QuickStats: React.FC<{ items: Item[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((it, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{it.label}</p>
              <p className={`text-2xl font-bold ${toneMap[it.tone]}`}>{it.value}</p>
            </div>
            <it.Icon className={`w-8 h-8 ${toneMap[it.tone]}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
