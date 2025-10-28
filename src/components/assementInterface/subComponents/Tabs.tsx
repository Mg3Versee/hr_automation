import React from "react";
import { BarChart, Activity } from "lucide-react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "results", label: "Results Management", icon: Activity },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "not_sent", label: "Not Sent" },
    { id: "expired", label: "Expired" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {tab.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
