"use client";
import React from "react";
import { Calendar } from "lucide-react";

export default function InterviewSummary({ date, timeText, title, candidateName }: Props) {
  const friendly = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start">
        <Calendar className="mr-3 mt-1 flex-shrink-0 text-blue-600" size={24} />
        <div>
          <h4 className="font-semibold text-gray-900">Interview Summary</h4>
          <p className="mt-0.5 text-[15px] font-semibold text-gray-900">
            {friendly} {timeText ? `at ${timeText}` : ""}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-gray-800">
                <span className="font-semibold text-gray-900">Position:</span>{" "}
                <span className="text-gray-900">{title ?? "—"}</span>
              </div>
              <div className="text-gray-800">
                <span className="font-semibold text-gray-900">Candidate:</span>{" "}
                <span className="text-gray-900">{candidateName ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
