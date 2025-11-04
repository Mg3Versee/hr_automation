"use client";

import React, { useState } from "react";
import { X, FileText, Zap, CheckCircle, XCircle } from "lucide-react";
import { runFullPipeline } from "@/services/api/pipelineAPI";

type Props = {
  job: { id: number | string; title: string; location?: string; description?: string };
  onPipelineStart?: () => void;
  onPipelineComplete?: () => void;
  onClose?: () => void;
};

const PipelineRunner: React.FC<Props> = ({ job, onPipelineStart, onPipelineComplete, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const run = async (createAssessment: boolean) => {
    setShowConfirm(false);
    setIsRunning(true);
    setStatus("Starting pipeline...");
    onPipelineStart?.();

    try {
      await runFullPipeline({
        job_id: job.id,
        job_title: job.title,
        job_desc: job.description || "",
        create_assessment: createAssessment,
      });
      setStatus("Pipeline completed successfully");
      setTimeout(() => {
        onPipelineComplete?.();
        onClose?.();
      }, 2000);
    } catch (e: any) {
      setStatus(`Error: ${e?.message || "Pipeline failed"}`);
      setIsRunning(false);
    }
  };

  if (!showConfirm && status) {
    const isError = status.startsWith("Error");
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
          {isError ? (
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          )}
          <p className="text-gray-900">{status}</p>
          {!isRunning && (
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configure Pipeline</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="font-medium text-gray-900">{job.title}</p>
          {job.location && <p className="text-sm text-gray-500">{job.location}</p>}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => run(true)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div className="text-left flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">Full Pipeline with Assessment</h4>
                <p className="text-sm text-gray-500 mt-1">• Scrape resumes<br/>• Create Testlify assessment<br/>• AI screening & scoring</p>
                <p className="text-xs text-blue-600 mt-2">~5-10 minutes</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => run(false)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-start">
              <Zap className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div className="text-left flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-green-600">Quick Pipeline (No Assessment)</h4>
                <p className="text-sm text-gray-500 mt-1">• Scrape resumes<br/>• AI screening & scoring only</p>
                <p className="text-xs text-green-600 mt-2">~3-5 minutes</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipelineRunner;
