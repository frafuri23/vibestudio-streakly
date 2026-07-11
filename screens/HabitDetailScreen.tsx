import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHabitStore } from "../lib/store";
import { calcStreaks, completionRate, last30Days } from "../lib/habits";
import { colors, radius, shadow, spacing, type } from "../lib/theme";
import WeekDots from "../components/WeekDots";
import { RootStackParamList } from "../App";

export default function HabitDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { id } = route.params as { id: string };

  const habit = useHabitStore((s) => s.habits.find((h) => h.id === id));
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const toggleToday = useHabitStore((s) => s.toggleToday);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const stats = useMemo(() => {
    if (!habit) return null;
    const s = calcStreaks(habit.completedDates);
    const rate30 = completionRate(habit, last30Days());
    return { ...s, rate30 };
  }, [habit]);

  if (!habit || !stats) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={{ padding: spacing.lg, color: colors.mutedText }}>Habit not found.</Text>
      </View>
    );
  }

  const days30 = last30Days();
  const completedSet = new Set(habit.completedDates);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{habit.name}</Text>
        <Pressable onPress={() => setConfirmDelete(true)} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconHero, { backgroundColor: habit.color + "22" }]}>
          <Ionicons name={habit.icon} size={40} color={habit.color} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={18} color={colors.flame} />
            <Text style={styles.statNumber}>{stats.current}</Text>
            <Text style={styles.statLabel}>Current</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={18} color={colors.accent} />
            <Text style={styles.statNumber}>{stats.longest}</Text>
            <Text style={styles.statLabel}>Best streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="stats-chart-outline" size={18} color={colors.success} />
            <Text style={styles.statNumber}>{Math.round(stats.rate30 * 100)}%</Text>
            <Text style={styles.statLabel}>30-day rate</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>This week</Text>
        <View style={styles.card}>
          <WeekDots completedDates={habit.completedDates} color={habit.color} />
        </View>

        <Text style={styles.sectionTitle}>Last 30 days</Text>
        <View style={styles.card}>
          <View style={styles.heatGrid}>
            {days30.map((d) => (
              <View
                key={d}
                style={[
                  styles.heatCell,
                  {
                    backgroundColor: completedSet.has(d) ? habit.color : colors.background,
                    borderColor: completedSet.has(d) ? habit.color : colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => toggleToday(habit.id)}
          style={[styles.toggleBtn, { backgroundColor: stats.doneToday ? colors.successTint : habit.color }]}
        >
          <Ionicons
            name={stats.doneToday ? "checkmark-circle" : "checkmark-circle-outline"}
            size={22}
            color={stats.doneToday ? colors.success : "#fff"}
          />
          <Text style={[styles.toggleText, { color: stats.doneToday ? colors.success : "#fff" }]}>
            {stats.doneToday ? "Completed today" : "Mark today done"}
          </Text>
        </Pressable>
      </ScrollView>

      {confirmDelete && (
        <View style={styles.overlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Delete "{habit.name}"?</Text>
            <Text style={styles.confirmSubtitle}>This removes the habit and its streak history. This can't be undone.</Text>
            <View style={styles.confirmRow}>
              <Pressable style={[styles.confirmBtn, styles.cancelBtn]} onPress={() => setConfirmDelete(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, styles.deleteBtn]}
                onPress={() => {
                  removeHabit(habit.id);
                  navigation.goBack();
                }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const CELL = 9;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconBtn: { width: 32, alignItems: "center" },
  headerTitle: { ...type.heading, color: colors.text, flex: 1, textAlign: "center" },
  backBtn: { margin: spacing.lg },
  iconHero: {
    alignSelf: "center",
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
  },
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
  statLabel: { fontSize: 11.5, fontWeight: "600", color: colors.mutedText },
  sectionTitle: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  heatGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  heatCell: { width: CELL, height: CELL, borderRadius: 3, borderWidth: 1 },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 54,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  toggleText: { ...type.heading },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10,10,15,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.floating,
  },
  confirmTitle: { ...type.heading, color: colors.text, marginBottom: spacing.sm },
  confirmSubtitle: { ...type.bodyRegular, color: colors.mutedText, marginBottom: spacing.lg, lineHeight: 20 },
  confirmRow: { flexDirection: "row", gap: spacing.md },
  confirmBtn: { flex: 1, height: 46, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cancelBtn: { backgroundColor: colors.background },
  cancelText: { ...type.body, color: colors.text },
  deleteBtn: { backgroundColor: colors.danger },
  deleteText: { ...type.body, color: "#fff" },
});
