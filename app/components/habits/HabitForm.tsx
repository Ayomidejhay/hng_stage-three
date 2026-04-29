// 'use client';

// import { useEffect, useState } from "react";
// import { validateHabitName } from "@/app/lib/validators";
// import type { Frequency, Habit, Weekday } from "@/app/types/habit";

// type Props = {
//   initial?: Habit | null;
//   onCancel: () => void;
//   onSubmit: (data: {
//     name: string;
//     description: string;
//     frequency: Frequency;
//     daysOfWeek: Weekday[];
//   }) => void;
// };

// const WEEKDAYS: { value: Weekday; short: string; label: string }[] = [
//   { value: 1, short: "Mon", label: "Monday" },
//   { value: 2, short: "Tue", label: "Tuesday" },
//   { value: 3, short: "Wed", label: "Wednesday" },
//   { value: 4, short: "Thu", label: "Thursday" },
//   { value: 5, short: "Fri", label: "Friday" },
//   { value: 6, short: "Sat", label: "Saturday" },
//   { value: 0, short: "Sun", label: "Sunday" },
// ];

// export function HabitForm({ initial, onCancel, onSubmit }: Props) {
//   const [name, setName] = useState(initial?.name ?? "");
//   const [description, setDescription] = useState(initial?.description ?? "");
//   const [frequency, setFrequency] = useState<Frequency>(initial?.frequency ?? "daily");
//   const [daysOfWeek, setDaysOfWeek] = useState<Weekday[]>(initial?.daysOfWeek ?? []);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setName(initial?.name ?? "");
//     setDescription(initial?.description ?? "");
//     setFrequency(initial?.frequency ?? "daily");
//     setDaysOfWeek(initial?.daysOfWeek ?? []);
//     setError(null);
//   }, [initial]);

//   const toggleDay = (d: Weekday) => {
//     setDaysOfWeek((prev) =>
//       prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b),
//     );
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const result = validateHabitName(name);
//     if (!result.valid) {
//       setError(result.error);
//       return;
//     }
//     if (frequency === "custom" && daysOfWeek.length === 0) {
//       setError("Pick at least one day for a custom schedule");
//       return;
//     }
//     onSubmit({
//       name: result.value,
//       description: description.trim(),
//       frequency,
//       daysOfWeek: frequency === "custom" ? daysOfWeek : [],
//     });
//   };

//   return (
//     <form
//       data-testid="habit-form"
//       onSubmit={handleSubmit}
//       className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
//     >
//       <h2 className="text-lg font-semibold text-slate-900">
//         {initial ? "Edit habit" : "New habit"}
//       </h2>

//       <div className="space-y-1">
//         <label htmlFor="habit-name" className="text-sm font-medium text-slate-700">
//           Name
//         </label>
//         <input
//           id="habit-name"
//           data-testid="habit-name-input"
//           type="text"
//           required
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
//         />
//       </div>

//       <div className="space-y-1">
//         <label
//           htmlFor="habit-description"
//           className="text-sm font-medium text-slate-700"
//         >
//           Description
//         </label>
//         <textarea
//           id="habit-description"
//           data-testid="habit-description-input"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows={2}
//           className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
//         />
//       </div>

//       <div className="space-y-1">
//         <label
//           htmlFor="habit-frequency"
//           className="text-sm font-medium text-slate-700"
//         >
//           Frequency
//         </label>
//         <select
//           id="habit-frequency"
//           data-testid="habit-frequency-select"
//           value={frequency}
//           onChange={(e) => setFrequency(e.target.value as Frequency)}
//           className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
//         >
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//           <option value="custom">Selected days</option>
//         </select>
//         <p className="text-xs text-slate-500">
//           {frequency === "daily" && "Tracked every day."}
//           {frequency === "weekly" && "Tracked once a week (on the day you created it)."}
//           {frequency === "monthly" && "Tracked once a month (on the day-of-month you created it)."}
//           {frequency === "custom" && "Tracked only on the weekdays you pick below."}
//         </p>
//       </div>

//       {frequency === "custom" && (
//         <div className="space-y-2" data-testid="habit-days-picker">
//           <span className="text-sm font-medium text-slate-700">Days of the week</span>
//           <div className="flex flex-wrap gap-2">
//             {WEEKDAYS.map((d) => {
//               const active = daysOfWeek.includes(d.value);
//               return (
//                 <button
//                   key={d.value}
//                   type="button"
//                   data-testid={`habit-day-${d.short.toLowerCase()}`}
//                   aria-pressed={active}
//                   aria-label={d.label}
//                   onClick={() => toggleDay(d.value)}
//                   className={`min-w-[3rem] rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
//                     active
//                       ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
//                       : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
//                   }`}
//                 >
//                   {d.short}
//                 </button>
//               );
//             })}
//           </div>
//           <div className="flex flex-wrap gap-2 pt-1">
//             <button
//               type="button"
//               onClick={() => setDaysOfWeek([1, 2, 3, 4, 5])}
//               className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
//             >
//               Weekdays
//             </button>
//             <button
//               type="button"
//               onClick={() => setDaysOfWeek([0, 6])}
//               className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
//             >
//               Weekends
//             </button>
//             <button
//               type="button"
//               onClick={() => setDaysOfWeek([0, 1, 2, 3, 4, 5, 6])}
//               className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
//             >
//               Every day
//             </button>
//             <button
//               type="button"
//               onClick={() => setDaysOfWeek([])}
//               className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       )}

//       {error && (
//         <p role="alert" className="text-sm text-red-600">
//           {error}
//         </p>
//       )}

//       <div className="flex items-center gap-2">
//         <button
//           type="submit"
//           data-testid="habit-save-button"
//           className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
//         >
//           Save habit
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }


'use client';

import { useState } from "react";
import { validateHabitName } from "../../lib/validators";
import type { Frequency, Habit, Weekday } from "../../types/habit";

type Props = {
  initial?: Habit | null;
  onCancel: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    frequency: Frequency;
    // daysOfWeek: Weekday[];
  }) => void;
};

const WEEKDAYS: { value: Weekday; short: string; label: string }[] = [
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
  { value: 6, short: "Sat", label: "Saturday" },
  { value: 0, short: "Sun", label: "Sunday" },
];

export function HabitForm({ initial, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [frequency, setFrequency] = useState<Frequency>(
    initial?.frequency ?? "daily"
  );
  const [daysOfWeek, setDaysOfWeek] = useState<Weekday[]>(
    initial?.daysOfWeek ?? []
  );
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (d: Weekday) => {
    setDaysOfWeek((prev) =>
      prev.includes(d)
        ? prev.filter((x) => x !== d)
        : [...prev, d].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateHabitName(name);
    if (!result.valid) {
      // setError(result.error);
      setError(result.error);
      return;
    }

    if (frequency === "custom" && daysOfWeek.length === 0) {
      setError("Pick at least one day for a custom schedule");
      return;
    }

    onSubmit({
      name: result.value,
      description: description.trim(),
      frequency,
      // daysOfWeek: frequency === "custom" ? daysOfWeek : [],
    });
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        {initial ? "Edit habit" : "New habit"}
      </h2>

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="habit-name" className="text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {error && (
  <p role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      {/* Frequency */}
      <div className="space-y-1">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-medium text-slate-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Selected days</option>
        </select>

        <p className="text-xs text-slate-500">
          {frequency === "daily" && "Tracked every day."}
          {frequency === "weekly" && "Tracked once a week (on the day you created it)."}
          {frequency === "monthly" && "Tracked once a month (on the day-of-month you created it)."}
          {frequency === "custom" && "Tracked only on the weekdays you pick below."}
        </p>
      </div>

      {/* Custom Days */}
      {frequency === "custom" && (
        <div className="space-y-2" data-testid="habit-days-picker">
          <span className="text-sm font-medium text-slate-700">
            Days of the week
          </span>

          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => {
              const active = daysOfWeek.includes(d.value);

              return (
                <button
                  key={d.value}
                  type="button"
                  data-testid={`habit-day-${d.short.toLowerCase()}`}
                  aria-pressed={active}
                  aria-label={d.label}
                  onClick={() => toggleDay(d.value)}
                  className={`min-w-[3rem] rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDaysOfWeek([1, 2, 3, 4, 5])}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Weekdays
            </button>
            <button
              type="button"
              onClick={() => setDaysOfWeek([0, 6])}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Weekends
            </button>
            <button
              type="button"
              onClick={() => setDaysOfWeek([0, 1, 2, 3, 4, 5, 6])}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Every day
            </button>
            <button
              type="button"
              onClick={() => setDaysOfWeek([])}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Save habit
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}