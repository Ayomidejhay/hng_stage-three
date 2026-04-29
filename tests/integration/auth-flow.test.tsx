import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../../app/components/auth/LoginForm";
import { SignupForm } from "../../app/components/auth/SignupForm";
import * as auth from "../../app/lib/auth";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(await screen.findByTestId("auth-signup-email"), "a@b.com");
    await user.type(screen.getByTestId("auth-signup-password"), "secret1");
    await user.click(screen.getByTestId("auth-signup-submit"));

    const users = JSON.parse(localStorage.getItem("habit-tracker-users") ?? "[]");
    const session = JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null");

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("a@b.com");

    expect(session).not.toBeNull();
    expect(session.email).toBe("a@b.com");
  });

  it("shows an error for duplicate signup email", async () => {
    auth.signup("dup@x.com", "pw");

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(await screen.findByTestId("auth-signup-email"), "dup@x.com");
    await user.type(screen.getByTestId("auth-signup-password"), "other");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(await screen.findByRole("alert")).toHaveTextContent(/exist/i);
  });

  it("submits the login form and stores the active session", async () => {
    auth.signup("user@x.com", "rightpass");
    localStorage.removeItem("habit-tracker-session");

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(await screen.findByTestId("auth-login-email"), "user@x.com");
    await user.type(screen.getByTestId("auth-login-password"), "rightpass");
    await user.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(localStorage.getItem("habit-tracker-session") ?? "null");

    expect(session).not.toBeNull();
    expect(session.email).toBe("user@x.com");
  });

  it("shows an error for invalid login credentials", async () => {
    auth.signup("user@x.com", "rightpass");
    localStorage.removeItem("habit-tracker-session");

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(await screen.findByTestId("auth-login-email"), "user@x.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpass");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid/i);
  });
});

// silence warnings
vi.spyOn(console, "warn").mockImplementation(() => {});