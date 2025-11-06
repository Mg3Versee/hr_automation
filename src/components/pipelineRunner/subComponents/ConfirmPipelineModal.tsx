import React from "react";
import { X, FileText, Zap, AlertCircle } from "lucide-react";

type Props = {
  job: { title?: string; location?: string };
  onClose?: () => void;
  onChoose: (createAssessment: boolean) => void;
};

const ConfirmPipelineModal: React.FC<Props> = ({ job, onClose, onChoose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configure Pipeline</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">Choose how you want to run the recruitment pipeline:</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-900">{job?.title}</p>
            <p className="text-sm text-gray-500">{job?.location}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => onChoose(true)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div className="text-left flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                  Full Pipeline with Assessment
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  • Scrape resumes<br />• Create Testlify assessment<br />• AI screening & scoring
                </p>
                <p className="text-xs text-blue-600 mt-2">~5-10 minutes</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onChoose(false)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-start">
              <Zap className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div className="text-left flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-green-600">
                  Quick Pipeline (No Assessment)
                </h4>
                <p className="text-sm text-gray-500 mt-1">• Scrape resumes<br />• AI screening & scoring only</p>
                <p className="text-xs text-green-600 mt-2">~3-5 minutes</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Note:</p>
              <p>You can create assessments later from the Assessments page if you skip it now.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPipelineModal;
