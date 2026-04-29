// import type { Session, User } from "../types/auth";
// import { getUsers, setUsers, setSession, uid } from "./storage";

// export type AuthResult =
//   | { ok: true; session: Session }
//   | { ok: false; error: string };

// export function signup(email: string, password: string): AuthResult {
//   const users = getUsers();
//   const normalized = email.trim().toLowerCase();
//   if (!normalized || !password) {
//     return { ok: false, error: "Email and password are required" };
//   }
//   if (users.some((u) => u.email.toLowerCase() === normalized)) {
//     return { ok: false, error: "User already exists" };
//   }
//   const user: User = {
//     id: uid(),
//     email: normalized,
//     password,
//     createdAt: new Date().toISOString(),
//   };
//   setUsers([...users, user]);
//   const session: Session = { userId: user.id, email: user.email };
//   setSession(session);
//   return { ok: true, session };
// }

// export function login(email: string, password: string): AuthResult {
//   const users = getUsers();
//   const normalized = email.trim().toLowerCase();
//   const user = users.find(
//     (u) => u.email.toLowerCase() === normalized && u.password === password,
//   );
//   if (!user) return { ok: false, error: "Invalid email or password" };
//   const session: Session = { userId: user.id, email: user.email };
//   setSession(session);
//   return { ok: true, session };
// }

// export function logout(): void {
//   setSession(null);
// }



import type { Session, User } from "../types/auth";
import { getUsers, setUsers, setSession, uid } from "./storage";

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function signup(email: string, password: string): AuthResult {
  const users = getUsers();
  const normalized = normalizeEmail(email);

  if (!normalized || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === normalized
  );

  if (existingUser) {
    return { ok: false, error: "User already exists" };
  }

  const user: User = {
    id: uid(),
    email: normalized,
    password,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, user];
  setUsers(updatedUsers);

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  // ✅ CRITICAL: persist session
  setSession(session);

  // ✅ Double safety: ensure it's actually written (helps with test timing)
  if (typeof window !== "undefined") {
    localStorage.setItem("habit-tracker-session", JSON.stringify(session));
  }

  return { ok: true, session };
}

export function login(email: string, password: string): AuthResult {
  const users = getUsers();
  const normalized = normalizeEmail(email);

  if (!normalized || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === normalized &&
      u.password === password
  );

  if (!user) {
    return { ok: false, error: "Invalid email or password" };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  // ✅ persist session
  setSession(session);

  // ✅ ensure localStorage is updated for tests
  if (typeof window !== "undefined") {
    localStorage.setItem("habit-tracker-session", JSON.stringify(session));
  }

  return { ok: true, session };
}

export function logout(): void {
  setSession(null);

  // ✅ ensure removal in tests
  if (typeof window !== "undefined") {
    localStorage.removeItem("habit-tracker-session");
  }
}