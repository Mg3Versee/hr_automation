import React from "react";

type Candidate = {
  id: number;
  name: string;
  email: string;
  exam_link_sent_date?: string | null;
  assessment_invite_link?: string | null;
};

const PendingList: React.FC<{
  items: Candidate[];
  onManual: (c: Candidate) => void;
}> = ({ items, onManual }) => {
  return (
    <div>
      <h4 className="font-medium mb-3">Pending Assessments ({items.length})</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending assessments</p>
        ) : (
          items.map((c) => (
            <div key={c.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                  <p className="text-xs text-gray-400">
                    Sent: {c.exam_link_sent_date ? new Date(c.exam_link_sent_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onManual(c)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Manual Process
                  </button>
                  {c.assessment_invite_link && (
                    <a
                      href={c.assessment_invite_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingList;
