import { Habit } from "./types";
import { HABIT_COLORS } from "./theme";
import { addDays, todayKey } from "./habits";

// Realistic sample habits shown on first launch so the app never opens to a
// bare empty state. Dates are generated relative to "today" so the streaks
// always look current no matter when the app is first opened.

function consecutiveDates(startOffset: number, count: number): string[] {
  const today = todayKey();
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(addDays(today, -(startOffset + i)));
  }
  return out;
}

export function generateSeedHabits(): Habit[] {
  const today = todayKey();

  // Drink Water — a strong, unbroken 12-day streak up through today.
  const waterDates = consecutiveDates(0, 12);

  // Read 20 Minutes — a 5-day streak that broke a few days ago, then
  // restarted yesterday (not done yet today): shows current vs. longest differ.
  const readDates = [...consecutiveDates(3, 5), ...consecutiveDates(1, 1)];

  // Morning Workout — just started, a fresh 2-day streak including today.
  const workoutDates = consecutiveDates(0, 2);

  // Sleep by 11pm — a spotty ~40% history over the last 20 days, not done today.
  const sleepDates: string[] = [];
  for (let i = 1; i <= 20; i++) {
    if (i % 2 === 0 || i % 5 === 0) sleepDates.push(addDays(today, -i));
  }

  return [
    {
      id: "seed-water",
      name: "Drink Water",
      icon: "water-outline",
      color: HABIT_COLORS[3],
      createdAt: addDays(today, -12),
      completedDates: waterDates,
    },
    {
      id: "seed-read",
      name: "Read 20 Minutes",
      icon: "book-outline",
      color: HABIT_COLORS[1],
      createdAt: addDays(today, -9),
      completedDates: readDates,
    },
    {
      id: "seed-workout",
      name: "Morning Workout",
      icon: "barbell-outline",
      color: HABIT_COLORS[2],
      createdAt: addDays(today, -2),
      completedDates: workoutDates,
    },
    {
      id: "seed-sleep",
      name: "Sleep by 11pm",
      icon: "moon-outline",
      color: HABIT_COLORS[0],
      createdAt: addDays(today, -20),
      completedDates: sleepDates,
    },
  ];
}
