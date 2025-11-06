"use client";
import React from "react";
import { X, FileText } from "lucide-react";

type Props = {
  open: boolean;
  value: string;
  defaultTitle?: string;
  onChange: (s: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function JobDescriptionModal({
  open,
  value,
  defaultTitle,
  onChange,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Add/Edit Job Description</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            rows={10}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter job description for ${defaultTitle ?? "the position"}...

Example:
We are seeking a talented ${defaultTitle ?? "professional"} to join our team.

Key Responsibilities:
- Develop and maintain software applications
- Collaborate with cross-functional teams
- Participate in code reviews

Requirements:
- Bachelor's degree in Computer Science or related field
- 3+ years of experience
- Strong problem-solving skills`}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save Job Description
          </button>
        </div>
      </div>
    </div>
  );
}
