export function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-screen items-center justify-center bg-slate-900 text-white"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-emerald-500" />
        <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="mt-2 text-sm text-slate-300">Loading…</p>
      </div>
    </div>
  );
}