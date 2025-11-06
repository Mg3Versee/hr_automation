"use client";
import React from "react";

export type Interviewer = { id: number; name: string; role: string; checked: boolean };

type Props = {
  items: Interviewer[];
  onToggle: (id: number) => void;
};

export default function InterviewerPicker({ items, onToggle }: Props) {
  return (
    <div>
      <h4 className="mb-3 font-medium text-gray-700">Interviewers</h4>
      <div className="font-medium text-gray-700 space-y-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between rounded-md border border-gray-500 p-3"
          >
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white">
                {it.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">{it.role}</div>
              </div>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              checked={it.checked}
              onChange={() => onToggle(it.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
