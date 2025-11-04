// Define StepKey type (replace with actual values if needed)
export type StepKey = string;

export type Props = {
  /** Human-readable status line (e.g., "Running AI-powered screening…") */
  status: string | null;
  /** 0–100; will be clamped just in case */
  progress: number;
  /** One of StepKey (or null before start) */
  currentStep: StepKey | null;
  /** Labels for each step key */
  steps: Record<StepKey, string>;
  onCancel?: () => void;
};