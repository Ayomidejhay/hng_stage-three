

export type Frequency = "daily" | "weekly" | "monthly" | "custom";

// 0 = Sunday, 1 = Monday, ... 6 = Saturday
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: Frequency;
  /** Selected weekdays (0-6). Used when frequency === "custom". */
  daysOfWeek?: Weekday[];
  createdAt: string;
  completions: string[];
};
