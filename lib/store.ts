import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "./types";
import { IoniconName } from "./theme";
import { todayKey } from "./habits";
import { generateSeedHabits } from "./seed";

type State = {
  habits: Habit[];
  // true once AsyncStorage rehydration has completed (or there was nothing to
  // rehydrate) — screens use this to avoid flashing the empty state while the
  // persisted habits are still loading.
  hydrated: boolean;
  // true once this device has ever completed a rehydration — guards the
  // one-time sample-data seed so deleting all habits later never re-seeds them.
  seeded: boolean;
  addHabit: (name: string, icon: IoniconName, color: string) => void;
  removeHabit: (id: string) => void;
  toggleToday: (id: string) => void;
  setHydrated: () => void;
};

export const useHabitStore = create<State>()(
  persist(
    (set, get) => ({
      habits: [],
      hydrated: false,
      seeded: false,
      addHabit: (name, icon, color) => {
        const habit: Habit = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: name.trim(),
          icon,
          color,
          createdAt: todayKey(),
          completedDates: [],
        };
        set({ habits: [habit, ...get().habits] });
      },
      removeHabit: (id) => set({ habits: get().habits.filter((h) => h.id !== id) }),
      toggleToday: (id) => {
        const key = todayKey();
        set({
          habits: get().habits.map((h) => {
            if (h.id !== id) return h;
            const has = h.completedDates.includes(key);
            return {
              ...h,
              completedDates: has ? h.completedDates.filter((d) => d !== key) : [...h.completedDates, key],
            };
          }),
        });
      },
      setHydrated: () => {
        const state = get();
        // First-ever launch on this device: nothing was persisted, so seed
        // realistic sample habits instead of opening on a bare empty state.
        if (!state.seeded && state.habits.length === 0) {
          set({ habits: generateSeedHabits(), seeded: true, hydrated: true });
        } else {
          set({ hydrated: true });
        }
      },
    }),
    {
      name: "streakly-habits",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
