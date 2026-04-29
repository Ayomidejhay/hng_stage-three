// export function validateHabitName(name: string): {
//   valid: boolean;
//   value: string;
//   error: string | null;
// } {
//   const value = (name ?? "").trim();
//   if (value.length === 0) {
//     return { valid: false, value, error: "Habit name is required" };
//   }
//   if (value.length > 60) {
//     return {
//       valid: false,
//       value,
//       error: "Habit name must be 60 characters or fewer",
//     };
//   }
//   return { valid: true, value, error: null };
// }

export function validateHabitName(name: unknown): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  if (typeof name !== "string") {
    return {
      valid: false,
      value: "",
      error: "required",
    };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return {
      valid: false,
      value: "",
      error: "required",
    };
  }

  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: "must be 60 characters or less",
    };
  }

  return {
    valid: true,
    value: trimmed,
    error: null,
  };
}