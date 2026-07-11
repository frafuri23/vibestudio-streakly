# Streakly

## Purpose
Habit tracker with daily check-ins and streak counting (current + longest streak per habit).

## Screens & navigation
- Tabs (bottom tab navigator, no header)
  - Home -> screens/HomeScreen.tsx: hero stats (done today / best streak), habit list with check button, + button opens NewHabit
  - Stats -> screens/StatsScreen.tsx: overview stats + habits ranked by current streak
  - Settings -> screens/SettingsScreen.tsx: habit count, reset all data
- Stack (root)
  - NewHabit -> screens/NewHabitScreen.tsx: modal, name + icon + color picker, creates a habit
  - HabitDetail -> screens/HabitDetailScreen.tsx: pushed from a habit row, shows week dots, 30-day heatmap, stats, mark done, delete (with confirm)

## Data model
- Habit { id, name, icon (Ionicons name string), color (hex), createdAt (yyyy-MM-dd), completedDates (yyyy-MM-dd[]) }
- Stored via zustand + AsyncStorage persist middleware (lib/store.ts), key "streakly-habits"
- Streak math in lib/habits.ts: calcStreaks (current/longest/doneToday), last7Days, last30Days, completionRate

## Features (status)
- Create habit with icon + color: done
- Toggle today's completion from list + detail: done
- Current & longest streak calculation: done
- Week view (7 dots) + 30-day heatmap: done
- Overview stats screen ranked by streak: done
- Delete habit with confirm modal: done
- Reset all data: done
- Persistence across reloads via AsyncStorage: done

## Decisions
- 2026-07-11: Light theme (accent purple #6C5CE7, flame orange for streaks) — habit trackers read best as light/clean apps.
- 2026-07-11: No backend/AI needed — pure local app with AsyncStorage persistence.
- 2026-07-11 (later): Switched to a dark theme per user request. lib/theme.ts palette repointed to a dark surface set (background #0D0D12, surface #1C1C25, elevated #25252F, text #F5F4FA, mutedText #9795A3, border #31313D, accent #8A7CFF, flame #FF9D5C) with matching tinted variants (accentTint/flameTint/successTint/dangerTint darkened). All screens/components consume these tokens (no ad-hoc colors), so no per-screen changes were needed. App.tsx StatusBar switched to style="light".

## User preferences
- Dark theme (not light) for the app's overall look.
