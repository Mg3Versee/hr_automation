import React, { useState } from "react";
import { Play } from "lucide-react";
import ConfirmPipelineModal from "./subComponents/ConfirmPipelineModal";
import PipelineProgress from "./subComponents/PipelineProgress";
import { runFullPipeline } from "@/services/api/pipelineAPI";

/** Props kept same as your original file */
type Props = {
  job: any;
  onPipelineStart?: () => void;
  onPipelineComplete?: () => void;
  onClose?: () => void;
  showButton?: boolean;
};

const PIPELINE_STEPS: Record<string, string> = {
  INIT: "Initializing pipeline",
  SCRAPING: "Scraping resumes",
  SCREENING: "AI screening resumes",
  ASSESSMENT_SETUP: "Setting up assessment",
  ASSESSMENT_CREATE: "Creating Testlify assessment",
  SENDING_INVITES: "Sending assessment invitations",
  COMPLETE: "Pipeline completed",
};

const InteractivePipelineRunner: React.FC<Props> = ({
  job,
  onPipelineStart,
  onPipelineComplete,
  onClose,
  showButton = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(!showButton);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const startPipeline = async (createAssessment: boolean) => {
    setShowConfirm(false);
    setIsRunning(true);
    setCurrentStep("INIT");
    setStatus(PIPELINE_STEPS.INIT);
    setProgress(5);
    onPipelineStart?.();

    try {
      // call service (no fetch/env logic in the component)
      await runFullPipeline({
        job_id: job?.id || "new",
        job_title: job?.title || "New Position",
        job_desc: job?.description || "",
        create_assessment: createAssessment,
      });

      // simulate progress as before
      const steps = createAssessment
        ? ["SCRAPING", "SCREENING", "ASSESSMENT_SETUP", "ASSESSMENT_CREATE", "SENDING_INVITES", "COMPLETE"]
        : ["SCRAPING", "SCREENING", "COMPLETE"];

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        setCurrentStep(s);
        setStatus(PIPELINE_STEPS[s]);
        setProgress(Math.min(100, ((i + 1) * 100) / steps.length));
        // same delay you had previously
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 2000));
      }

      setIsRunning(false);
      setStatus("Pipeline completed successfully!");
      setTimeout(() => {
        onPipelineComplete?.();
        onClose?.();
      }, 2000);
    } catch (err: any) {
      console.error("Pipeline error:", err);
      setStatus(`Error: ${err?.message || "Pipeline failed"}`);
      setIsRunning(false);
    }
  };

  // button-only mode
  if (showButton) {
    return (
      <>
        {showConfirm && (
          <ConfirmPipelineModal
            job={job}
            onClose={onClose}
            onChoose={(create) => startPipeline(create)}
          />
        )}
        {isRunning && (
          <PipelineProgress
            status={status}
            progress={progress}
            currentStep={currentStep}
            steps={PIPELINE_STEPS}
            onCancel={() => {
              setIsRunning(false);
              setStatus("Pipeline cancelled");
              onClose?.();
            }}
          />
        )}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isRunning}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isRunning ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Play className="w-4 h-4 mr-2" />
          Run Pipeline
        </button>
      </>
    );
  }

  // modal-first mode (original behavior)
  if (showConfirm) {
    return (
      <ConfirmPipelineModal
        job={job}
        onClose={onClose}
        onChoose={(create) => startPipeline(create)}
      />
    );
  }

  if (isRunning) {
    return (
      <PipelineProgress
        status={status}
        progress={progress}
        currentStep={currentStep}
        steps={PIPELINE_STEPS}
        onCancel={() => {
          setIsRunning(false);
          setStatus("Pipeline cancelled");
          onClose?.();
        }}
      />
    );
  }

  return null;
};

export default InteractivePipelineRunner;
