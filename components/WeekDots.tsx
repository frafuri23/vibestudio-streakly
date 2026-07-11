import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { last7Days, weekdayLabel } from "../lib/habits";
import { colors, radius, spacing } from "../lib/theme";

export default function WeekDots({ completedDates, color, size = 30 }: { completedDates: string[]; color: string; size?: number }) {
  const days = last7Days();
  const set = new Set(completedDates);
  return (
    <View style={styles.row}>
      {days.map((d) => {
        const done = set.has(d);
        return (
          <View key={d} style={styles.col}>
            <View
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: done ? color : colors.background,
                  borderColor: done ? color : colors.border,
                },
              ]}
            />
            <Text style={styles.label}>{weekdayLabel(d)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { alignItems: "center", gap: spacing.xs },
  dot: { borderWidth: 1.5 },
  label: { fontSize: 11, fontWeight: "600", color: colors.mutedText },
});
