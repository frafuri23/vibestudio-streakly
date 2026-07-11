import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHabitStore } from "../lib/store";
import { calcStreaks, completionRate, last30Days } from "../lib/habits";
import { colors, radius, shadow, spacing, type } from "../lib/theme";
import EmptyState from "../components/EmptyState";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const habits = useHabitStore((s) => s.habits);

  const overview = useMemo(() => {
    const days = last30Days();
    let totalStreak = 0;
    let bestStreak = 0;
    let avgRate = 0;
    habits.forEach((h) => {
      const s = calcStreaks(h.completedDates);
      totalStreak += s.current;
      bestStreak = Math.max(bestStreak, s.longest);
      avgRate += completionRate(h, days);
    });
    return {
      avgRate: habits.length ? avgRate / habits.length : 0,
      totalStreak,
      bestStreak,
    };
  }, [habits]);

  const ranked = useMemo(() => {
    return [...habits]
      .map((h) => ({ habit: h, ...calcStreaks(h.completedDates) }))
      .sort((a, b) => b.current - a.current);
  }, [habits]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Overview</Text>
      </View>

      {habits.length === 0 ? (
        <EmptyState
          icon="stats-chart-outline"
          title="No stats yet"
          subtitle="Create a habit and start checking in to see your progress here."
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={18} color={colors.flame} />
              <Text style={styles.statNumber}>{overview.totalStreak}</Text>
              <Text style={styles.statLabel}>Combined streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy-outline" size={18} color={colors.accent} />
              <Text style={styles.statNumber}>{overview.bestStreak}</Text>
              <Text style={styles.statLabel}>All-time best</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="pulse-outline" size={18} color={colors.success} />
              <Text style={styles.statNumber}>{Math.round(overview.avgRate * 100)}%</Text>
              <Text style={styles.statLabel}>Avg 30-day</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ranked by streak</Text>
          {ranked.map(({ habit, current, longest }, i) => (
            <View key={habit.id} style={styles.rankRow}>
              <Text style={styles.rankIndex}>{i + 1}</Text>
              <View style={[styles.rankIcon, { backgroundColor: habit.color + "22" }]}>
                <Ionicons name={habit.icon} size={18} color={habit.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rankName} numberOfLines={1}>{habit.name}</Text>
                <Text style={styles.rankSub}>Best {longest} days</Text>
              </View>
              <View style={styles.rankStreak}>
                <Ionicons name="flame" size={14} color={current > 0 ? colors.flame : colors.mutedText} />
                <Text style={[styles.rankStreakText, { color: current > 0 ? colors.flame : colors.mutedText }]}>{current}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  title: { ...type.display, color: colors.text },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: 4,
    ...shadow.card,
  },
  statNumber: { ...type.title, color: colors.text, marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: "600", color: colors.mutedText, textAlign: "center" },
  sectionTitle: { ...type.heading, color: colors.text, marginBottom: spacing.md },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadow.card,
  },
  rankIndex: { width: 18, textAlign: "center", fontSize: 13, fontWeight: "700", color: colors.mutedText },
  rankIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  rankName: { ...type.body, color: colors.text },
  rankSub: { fontSize: 12, color: colors.mutedText, marginTop: 2 },
  rankStreak: { flexDirection: "row", alignItems: "center", gap: 4 },
  rankStreakText: { fontSize: 14, fontWeight: "800" },
});
