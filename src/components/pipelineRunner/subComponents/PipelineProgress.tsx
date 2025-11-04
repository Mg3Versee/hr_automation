// import React from "react";
// import { CheckCircle } from "lucide-react";

// type Props = {
//   status: string | null;
//   progress: number;
//   currentStep: string | null;
//   steps: Record<string, string>;
//   onCancel?: () => void;
// };

// const PipelineProgress: React.FC<Props> = ({
//   status,
//   progress,
//   currentStep,
//   steps,
//   onCancel,
// }) => {
//   const order = ["INIT","SCRAPING","SCREENING","ASSESSMENT_SETUP","ASSESSMENT_CREATE","SENDING_INVITES","COMPLETE"];
//   const stepIndex = (s?: string | null) => (s ? order.indexOf(s) : -1);

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline in Progress</h3>

//         {/* Progress */}
//         <div className="w-full bg-gray-200 rounded-full h-3">
//           <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
//         </div>

//         {/* Status */}
//         <div className="flex items-center mt-4">
//           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3" />
//           <span className="text-gray-700">{status}</span>
//         </div>

//         {/* Steps */}
//         <div className="space-y-2 mt-4">
//           {Object.entries(steps).map(([key, label]) => {
//             const isCompleted = stepIndex(key) < stepIndex(currentStep);
//             const isCurrent = key === currentStep;
//             return (
//               <div key={key} className="flex items-center">
//                 {isCompleted ? (
//                   <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//                 ) : isCurrent ? (
//                   <div className="w-5 h-5 border-2 border-blue-600 rounded-full mr-2 animate-pulse" />
//                 ) : (
//                   <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2" />
//                 )}
//                 <span
//                   className={`text-sm ${
//                     isCompleted ? "text-green-600" : isCurrent ? "text-blue-600 font-medium" : "text-gray-400"
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             onClick={onCancel}
//             className="text-sm text-gray-500 hover:text-gray-700"
//           >
//             Cancel Pipeline
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PipelineProgress;

import React from "react";
import { CheckCircle } from "lucide-react";
import { StepKey, Props } from "@/services/interfaces/pipelineProgress";


const ORDER: StepKey[] = [
  "INIT",
  "SCRAPING",
  "SCREENING",
  "ASSESSMENT_SETUP",
  "ASSESSMENT_CREATE",
  "SENDING_INVITES",
  "COMPLETE",
];

const PipelineProgress: React.FC<Props> = ({
  status,
  progress,
  currentStep,
  steps,
  onCancel,
}) => {
  const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
  const pct = clamp(progress);

  const currentIdx = currentStep ? ORDER.indexOf(currentStep) : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="w-full max-w-lg mx-4 rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pipeline-title"
      >
        <h3 id="pipeline-title" className="mb-4 text-lg font-semibold text-gray-900">
          Pipeline in Progress
        </h3>

        {/* Progress */}
        <div
          className="w-full rounded-full bg-gray-200 h-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label="Pipeline progress"
        >
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600" />
          <span className="text-gray-700">{status ?? "Starting…"}</span>
        </div>

        {/* Steps (rendered in deterministic ORDER) */}
        <div className="mt-4 space-y-2">
          {ORDER.map((key, i) => {
            const label = steps[key] ?? key;
            const isCompleted = currentIdx > i; // strictly before current
            const isCurrent = currentIdx === i;

            return (
              <div key={key} className="flex items-center">
                {isCompleted ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                ) : isCurrent ? (
                  <div className="mr-2 h-5 w-5 animate-pulse rounded-full border-2 border-blue-600" />
                ) : (
                  <div className="mr-2 h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
                <span
                  className={`text-sm ${
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "font-medium text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {onCancel && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel Pipeline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineProgress;
