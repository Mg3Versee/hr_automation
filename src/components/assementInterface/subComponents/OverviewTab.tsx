import React from "react";
import { Activity, Send, Download } from "lucide-react";
import { Job } from "@/services/interfaces/AssementInterface";

interface OverviewTabProps {
  selectedJob: Job;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ selectedJob }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Assessment Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sent</span>
            <span className="font-medium">10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium">Check Results</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Send className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium">Send Reminders</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Download className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium">Export Data</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
