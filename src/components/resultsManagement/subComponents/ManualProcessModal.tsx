import React, { useMemo, useState } from "react";

type Candidate = { id: number; name: string; email: string };

const ManualProcessModal: React.FC<{
  candidate: Candidate;
  onClose: () => void;
  onSubmit: (score: number, total: number) => void;
}> = ({ candidate, onClose, onSubmit }) => {
  const [score, setScore] = useState("");
  const [total, setTotal] = useState("100");

  const percentage = useMemo(() => {
    const s = Number(score);
    const t = Number(total);
    if (!t || Number.isNaN(s) || Number.isNaN(t)) return 0;
    return Math.max(0, Math.min(100, (s / t) * 100));
  }, [score, total]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Manual Process: {candidate?.name}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(Number(score), Number(total));
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Score (correct answers)</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
              placeholder="Enter number of correct answers"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Total Questions</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={1}
            />
          </div>
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Percentage:</strong> {percentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Candidates scoring ≥ 70% will be scheduled for interviews</p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!score || !total}
            >
              Process Result
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualProcessModal;
