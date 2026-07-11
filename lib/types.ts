import { IoniconName } from "./theme";

export type Habit = {
  id: string;
  name: string;
  icon: IoniconName;
  color: string;
  createdAt: string; // ISO date yyyy-MM-dd
  completedDates: string[]; // ISO dates yyyy-MM-dd
};
