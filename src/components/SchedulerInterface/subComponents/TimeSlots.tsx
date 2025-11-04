// "use client";
// import React from "react";
// import { Clock, CheckCircle, ChevronLeft } from "lucide-react";

// export type Slot = { id: number; time: string; available: boolean };

// type Props = {
//   date: Date;
//   morning: Slot[];
//   afternoon: Slot[];
//   selected?: Slot | null;
//   onPick: (slot: Slot) => void;
//   onBack: () => void;
// };

// export default function TimeSlots({
//   date,
//   morning,
//   afternoon,
//   selected,
//   onPick,
//   onBack,
// }: Props) {
//   const renderList = (slots: Slot[]) =>
//     slots.map((slot) => (
//       <button
//         key={slot.id}
//         disabled={!slot.available}
//         onClick={() => slot.available && onPick(slot)}
//         className={[
//           "mb-2 flex w-full cursor-pointer items-center justify-between rounded-md border p-3 text-left",
//           slot.available
//             ? "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
//             : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50",
//           selected?.id === slot.id ? "border-blue-500 bg-blue-50" : "",
//         ].join(" ")}
//       >
//         <span className="flex items-center">
//           <Clock size={16} className="mr-2 text-gray-500" />
//           {slot.time}
//         </span>
//         {!slot.available && <span className="text-xs text-gray-500">Unavailable</span>}
//         {selected?.id === slot.id && <CheckCircle size={16} className="text-green-500" />}
//       </button>
//     ));

//   const friendly = date.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div>
//       <button onClick={onBack} className="mb-4 flex items-center text-blue-600">
//         <ChevronLeft size={16} />
//         <span>Back to calendar</span>
//       </button>

//       <h3 className="mb-4 text-lg font-medium text-gray-900">
//         Select a time on {friendly}
//       </h3>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <h4 className="mb-3 font-medium text-gray-800">Morning</h4>
//           {renderList(morning)}
//         </div>
//         <div>
//           <h4 className="mb-3 font-medium text-gray-800">Afternoon</h4>
//           {renderList(afternoon)}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/scheduler/TimeSlots.tsx
"use client";

import React from "react";
import { Clock } from "lucide-react";

export type Slot = { id: number | string; time: string; available: boolean };

type Props = {
  date: Date;
  morning: Slot[];
  afternoon: Slot[];
  selected: Slot | null;
  onPick: (s: Slot) => void;
  onBack: () => void;
};

export default function TimeSlots({
  date,
  morning,
  afternoon,
  selected,
  onPick,
  onBack,
}: Props) {
  const friendly = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const SlotButton: React.FC<{ slot: Slot }> = ({ slot }) => {
    const isSelected = selected?.id === slot.id;
    const base =
      "flex items-center justify-between w-full rounded-md border px-4 py-3 transition";

    if (!slot.available) {
      return (
        <button
          type="button"
          disabled
          className={`${base} cursor-not-allowed bg-gray-50 border-gray-200`}
          aria-disabled="true"
        >
          <span className="flex items-center text-gray-400">
            <Clock size={16} className="mr-2 text-gray-400" />
            {slot.time}
          </span>
          <span className="text-xs text-gray-400">Unavailable</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onPick(slot)}
        className={[
          base,
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
            : "border-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        <span className={["flex items-center", isSelected ? "text-gray-900" : "text-gray-900"].join(" ")}>
          <Clock
            size={16}
            className={[
              "mr-2",
              isSelected ? "text-blue-600" : "text-gray-700",
            ].join(" ")}
          />
          <span className="text-[15px] font-semibold">{slot.time}</span>
        </span>
        {isSelected && (
          <span className="text-xs font-medium text-blue-700">Selected</span>
        )}
      </button>
    );
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm font-medium text-blue-700 hover:underline"
      >
        &lt; Back to calendar
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Select a time on <span className="text-gray-900">{friendly}</span>
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 font-semibold text-gray-900">Morning</h4>
          <div className="space-y-3">
            {morning.map((slot) => (
              <SlotButton key={slot.id} slot={slot} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-900">Afternoon</h4>
          <div className="space-y-3">
            {afternoon.map((slot) => (
              <SlotButton key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
