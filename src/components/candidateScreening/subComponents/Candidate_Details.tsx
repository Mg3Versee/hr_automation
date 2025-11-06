"use client";

import React from "react";
import { Eye, Send, Calendar, Download, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Candidate } from "@/services/interfaces/CandidateScreening";

interface CandidateDetailsProps {
  candidate: Candidate | null;
  onSendReminder?: (candidateId: string | number) => void;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({ candidate, onSendReminder }) => {
  const router = useRouter();

  if (!candidate) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium">Select a candidate to view details</p>
        <p className="text-sm mt-1">Choose a candidate from the list to see their information</p>
      </div>
    );
  }

  const StatusIcon = candidate.statusInfo?.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-medium">
            {candidate.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
            <p className="text-gray-500">{candidate.job_title}</p>
            <div className="flex items-center space-x-3 mt-2">
              <a href={`mailto:${candidate.email}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {candidate.email}
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-blue-100 bg-white">
            <div>
              <div className={`text-2xl font-bold ${candidate.scoreColor}`}>
                {(candidate.displayScore ?? 0).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">ATS Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Status</p>
            {StatusIcon && (
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${candidate.statusInfo?.color}`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {candidate.displayStatus}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Applied</p>
            <p className="font-medium">
              {candidate.processed_date ? new Date(candidate.processed_date).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        {candidate.exam_completed && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assessment Score</p>
                <p className={`text-lg font-semibold ${(candidate.exam_percentage ?? 0) >= 70 ? "text-green-600" : "text-red-600"}`}>
                  {candidate.exam_percentage?.toFixed(0)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="font-medium">{candidate.exam_completed ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}

        {candidate.interview_scheduled && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview Status</p>
                <p className="text-green-600 font-medium">Scheduled</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {candidate.resume_path && (
          <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Download Resume
          </button>
        )}

        {candidate.exam_link_sent && !candidate.exam_completed && !candidate.link_expired && onSendReminder && (
          <button
            onClick={() => onSendReminder(candidate.id)}
            className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Assessment Reminder
          </button>
        )}

        {candidate.exam_completed && (candidate.exam_percentage ?? 0) >= 70 && !candidate.interview_scheduled && (
          <button
            onClick={() => router.push(`/scheduler?candidate_id=${candidate.id}`)}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Interview
          </button>
        )}

        <button
          onClick={() => router.push(`/candidates/${candidate.id}`)} 
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Full Profile
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Job ID</span>
            <span className="font-medium">{candidate.job_id}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Candidate ID</span>
            <span className="font-medium">{candidate.id}</span>
          </div>
          {candidate.status && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Initial Status</span>
              <span className="font-medium">{candidate.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CandidateDetails);
