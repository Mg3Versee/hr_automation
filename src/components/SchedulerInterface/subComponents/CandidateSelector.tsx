// "use client";
// import React from "react";
// import { CheckCircle, FileText } from "lucide-react";
// import type { RawCandidate } from "@/services/api/schedulerAPI";

// type Props = {
//   items: RawCandidate[];
//   selected?: RawCandidate | null;
//   onPick: (c: RawCandidate) => void;
// };

// export default function CandidateSelector({ items, selected, onPick }: Props) {
//   return (
//     <div>
//       <h4 className="mb-3 font-medium text-gray-700">Select Candidate</h4>
//       <div className="space-y-2">
//         {items.map((c) => {
//           const chosen = selected?.id === c.id;
//           return (
//             <button
//               key={c.id}
//               onClick={() => onPick(c)}
//               className={[
//                 "flex w-full cursor-pointer items-center justify-between rounded-md border p-3 text-left",
//                 chosen
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-200 hover:border-blue-500 hover:bg-blue-50",
//               ].join(" ")}
//             >
//               <div className="flex items-center">
//                 <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
//                   {c.photo ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={c.photo} alt={c.name ?? "candidate"} className="h-10 w-10 rounded-full" />
//                   ) : (
//                     (c.name ?? "?").charAt(0)
//                   )}
//                 </div>
//                 <div>
//                   <div className="font-medium">{c.name ?? "Unknown"}</div>
//                   <div className="text-sm text-gray-500">
//                     {c.job_title ?? c.role ?? "Position not specified"}
//                   </div>
//                   {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
//                   {c.resume_path && (
//                     <div className="mt-1 flex items-center text-xs text-green-600">
//                       <FileText size={12} className="mr-1" />
//                       Resume available
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {chosen && <CheckCircle size={16} className="text-green-500" />}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import type { RawCandidate } from "@/services/api/schedulerAPI";

type Props = {
  items: RawCandidate[];
  selected?: RawCandidate | null;
  onPick: (c: RawCandidate) => void;
};

export default function CandidateSelector({ items, selected, onPick }: Props) {
  return (
    <div>
      <h4 className="mb-3 font-semibold text-gray-600">Select Candidate</h4>

      <div className="space-y-2">
        {items.map((c) => {
          const chosen = selected?.id === c.id;

          return (
            // eslint-disable-next-line jsx-a11y/role-supports-aria-props
            <button
              key={c.id}
              onClick={() => onPick(c)}
              aria-selected={chosen}
              className={[
                "flex w-full cursor-pointer items-center justify-between rounded-md border p-3 text-left transition",
                chosen
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50",
              ].join(" ")}
            >
              <div className="flex items-center">
                {/* Avatar / Initial */}
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {c.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.photo}
                      alt={c.name ?? "candidate"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (c.name ?? "?").trim().charAt(0).toUpperCase()
                  )}
                </div>

                {/* Text block */}
                <div>
                  {/* BRIGHT name */}
                  <div
                    className={[
                      "font-medium text-gray-700",
                      chosen ? "text-blue-700" : "text-gray-900",
                    ].join(" ")}
                  >
                    {c.name ?? "Unknown"}
                  </div>

                  {/* Role / title */}
                  <div className="text-sm text-gray-800">
                    {c.job_title ?? c.role ?? "Position not specified"}
                  </div>

                  {/* Email */}
                  {c.email && (
                    <div className="text-xs text-gray-700">{c.email}</div>
                  )}

                  {/* Resume indicator */}
                  {c.resume_path && (
                    <div className="mt-1 flex items-center text-xs font-semibold text-green-700">
                      <FileText size={12} className="mr-1" />
                      Resume available
                    </div>
                  )}
                </div>
              </div>

              {chosen && <CheckCircle size={18} className="text-green-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
