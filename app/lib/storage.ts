import type { Session, User } from "../types/auth";
import type { Habit } from "../types/habit";

export const STORAGE_KEYS = {
    users: "habit-tracker-users",
    session: "habit-tracker-sessions",
    habits: "habit-tracker-habits",
} as const;

function isBrowser() {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): User[] {
    return read<User[]>(STORAGE_KEYS.users, []);
}
export function setUsers(users: User[]): void {
  write(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
    return read<Session | null>(STORAGE_KEYS.session, null);
}
export function setSession(session: Session | null): void {
  if (!isBrowser()) return;
  if (session === null) {
    localStorage.removeItem(STORAGE_KEYS.session);
  } else {
    write(STORAGE_KEYS.session, session);
  }
}

export function getHabits(): Habit[] {
    return read<Habit[]>(STORAGE_KEYS.habits, []);
}
export function setHabits(habits: Habit[]): void {
    write(STORAGE_KEYS.habits, habits);
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}