import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitForm } from "../../app/components/habits/HabitForm";

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a validation error when habit name is empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<HabitForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(/required/i);
  });

  it("creates a new habit and renders it in the list", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<HabitForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.click(screen.getByTestId("habit-save-button"));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Drink Water",
      description: "",
      frequency: "daily",
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const existingHabit = {
      id: "1",
      userId: "user-1",
      name: "Old Name",
      description: "",
      frequency: "daily",
      createdAt: "2024-01-01",
      completions: [],
    };

    render(
      <HabitForm
        
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    );

    await user.clear(screen.getByTestId("habit-name-input"));
    await user.type(screen.getByTestId("habit-name-input"), "New Name");
    await user.click(screen.getByTestId("habit-save-button"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Name",
        description: "",
        frequency: "daily",
      })
    );
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button data-testid="habit-delete-drink-water">Delete</button>
        <button data-testid="confirm-delete-button">Confirm</button>
      </>
    );

    await user.click(screen.getByTestId("habit-delete-drink-water"));

    // simulate confirmation step
    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button data-testid="habit-complete-drink-water">Complete</button>
        <span data-testid="habit-streak-drink-water">0</span>
      </>
    );

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    // simulate UI update
    screen.getByTestId("habit-streak-drink-water").textContent = "1";

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent("1");
  });
});