// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   getHabits,
//   getSession,
//   setHabits,
//   setSession,
//   todayISO,
//   uid,
// } from "../lib/storage";
// import { toggleHabitCompletion } from "../lib/habits";
// import { HabitCard } from "../components/habits/HabitCard";
// import { HabitForm } from "../components/habits/HabitForm";
// import type { Habit } from "../types/habit";
// import type { Session } from "../types/auth";

// export const metadata = {
//   title: "Dashboard — Habit Tracker",
//   description: "Your daily habits and streaks.",
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // ✅ Initialize state lazily (no useEffect needed)
//   const [session, setLocalSession] = useState<Session | null>(() => getSession());
//   const [habits, setHabitsState] = useState<Habit[]>(() => getHabits());

//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Habit | null>(null);

//   // ✅ Handle redirect safely in effect (side effect)
//   useEffect(() => {
//     if (!session) {
//       router.replace("/login");
//     }
//   }, [session, router]);

//   // Prevent rendering until redirect decision is made
//   if (!session) return null;

//   const myHabits = useMemo(
//     () => habits.filter((h) => h.userId === session.userId),
//     [habits, session],
//   );

//   const persistHabits = (next: Habit[]) => {
//     setHabits(next);          // persist to storage
//     setHabitsState(next);     // update UI
//   };

//   const handleCreate = ({
//     name,
//     description,
//     frequency,
//     daysOfWeek,
//   }: {
//     name: string;
//     description: string;
//     frequency: Habit["frequency"];
//     daysOfWeek: NonNullable<Habit["daysOfWeek"]>;
//   }) => {
//     if (!session) return;

//     if (editing) {
//       const updated: Habit = {
//         ...editing,
//         name,
//         description,
//         frequency,
//         daysOfWeek: frequency === "custom" ? daysOfWeek : undefined,
//       };

//       persistHabits(habits.map((h) => (h.id === editing.id ? updated : h)));
//       setEditing(null);
//       setShowForm(false);
//       return;
//     }

//     const habit: Habit = {
//       id: uid(),
//       userId: session.userId,
//       name,
//       description,
//       frequency,
//       daysOfWeek: frequency === "custom" ? daysOfWeek : undefined,
//       createdAt: new Date().toISOString(),
//       completions: [],
//     };

//     persistHabits([...habits, habit]);
//     setShowForm(false);
//   };

//   const handleToggleComplete = (habit: Habit) => {
//     const next = toggleHabitCompletion(habit, todayISO());
//     persistHabits(habits.map((h) => (h.id === habit.id ? next : h)));
//   };

//   const handleDelete = (habit: Habit) => {
//     persistHabits(habits.filter((h) => h.id !== habit.id));
//   };

//   const handleLogout = () => {
//     setSession(null);        // clear storage
//     setLocalSession(null);   // update state
//     router.replace("/login");
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
//       <div className="mx-auto w-full max-w-2xl space-y-6">
//         <header className="flex items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Your habits</h1>
//             <p className="text-sm text-slate-600">
//               Signed in as {session.email}
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
//           >
//             Log out
//           </button>
//         </header>

//         {!showForm && (
//           <button
//             onClick={() => {
//               setEditing(null);
//               setShowForm(true);
//             }}
//             className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto"
//           >
//             + New habit
//           </button>
//         )}

//         {showForm && (
//           <HabitForm
//             initial={editing}
//             onCancel={() => {
//               setShowForm(false);
//               setEditing(null);
//             }}
//             onSubmit={handleCreate}
//           />
//         )}

//         {myHabits.length === 0 ? (
//           <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
//             <p className="text-base font-medium text-slate-900">
//               No habits yet
//             </p>
//             <p className="mt-1 text-sm text-slate-600">
//               Create your first habit to start building a streak.
//             </p>
//           </div>
//         ) : (
//           <ul className="space-y-3">
//             {myHabits.map((habit) => (
//               <HabitCard
//                 key={habit.id}
//                 habit={habit}
//                 onToggleComplete={handleToggleComplete}
//                 onEdit={(h) => {
//                   setEditing(h);
//                   setShowForm(true);
//                 }}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </ul>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
   getHabits,
   getSession,
   setHabits,
   setSession,
   todayISO,
   uid,
 } from "../lib/storage";
 import { toggleHabitCompletion } from "../lib/habits";
 import { HabitCard } from "../components/habits/HabitCard";
 import { HabitForm } from "../components/habits/HabitForm";
 import type { Habit } from "../types/habit";
 import type { Session } from "../types/auth";



export default function DashboardPage() {
  const router = useRouter();

  // initialize hooks
  const [session, setLocalSession] = useState<Session | null>(() => getSession());
  const [habits, setHabitsState] = useState<Habit[]>(() => getHabits());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  
  const myHabits = useMemo(() => {
    if (!session) return [];
    return habits.filter((h) => h.userId === session.userId);
  }, [habits, session]);

  //Redirect
  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  
  if (!session) return null;

  const persistHabits = (next: Habit[]) => {
    setHabits(next);
    setHabitsState(next);
  };

  const handleCreate = ({
    name,
    description,
    frequency,
    // daysOfWeek,
  }: {
    name: string;
    description: string;
    frequency: Habit["frequency"];
    // daysOfWeek: NonNullable<Habit["daysOfWeek"]>;
  }) => {
    if (!session) return;

    if (editing) {
      const updated: Habit = {
        ...editing,
        name,
        description,
        frequency,
        // daysOfWeek: frequency === "custom" ? daysOfWeek : undefined,
      };

      persistHabits(habits.map((h) => (h.id === editing.id ? updated : h)));
      setEditing(null);
      setShowForm(false);
      return;
    }

    const habit: Habit = {
      id: uid(),
      userId: session.userId,
      name,
      description,
      frequency,
      // daysOfWeek: frequency === "custom" ? daysOfWeek : undefined,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    persistHabits([...habits, habit]);
    setShowForm(false);
  };

  const handleToggleComplete = (habit: Habit) => {
    const next = toggleHabitCompletion(habit, todayISO());
    persistHabits(habits.map((h) => (h.id === habit.id ? next : h)));
  };

  const handleDelete = (habit: Habit) => {
    persistHabits(habits.filter((h) => h.id !== habit.id));
  };

  const handleLogout = () => {
    setSession(null);
    setLocalSession(null);
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your habits</h1>
            <p className="text-sm text-slate-600">
              Signed in as {session.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md  bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-100 hover:text-red-700"
          >
            Log out
          </button>
        </header>

        {!showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto"
          >
            + New habit
          </button>
        )}

        {showForm && (
          <HabitForm
            initial={editing}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSubmit={handleCreate}
          />
        )}

        {myHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-base font-medium text-slate-900">
              No habits yet
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Create your first habit to start building a streak.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {myHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onEdit={(h) => {
                  setEditing(h);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}