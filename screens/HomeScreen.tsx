import React, { useMemo, useRef, useEffect } from "react";
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHabitStore } from "../lib/store";
import { calcStreaks, todayKey } from "../lib/habits";
import { colors, radius, shadow, spacing, type } from "../lib/theme";
import HabitRow from "../components/HabitRow";
import EmptyState from "../components/EmptyState";
import { RootStackParamList } from "../App";

const DATE_FMT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const habits = useHabitStore((s) => s.habits);
  const toggleToday = useHabitStore((s) => s.toggleToday);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, []);

  const stats = useMemo(() => {
    const today = todayKey();
    let doneToday = 0;
    let bestStreak = 0;
    habits.forEach((h) => {
      const s = calcStreaks(h.completedDates);
      if (s.doneToday) doneToday += 1;
      bestStreak = Math.max(bestStreak, s.current);
    });
    return { doneToday, total: habits.length, bestStreak, today };
  }, [habits]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: fade, flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{DATE_FMT.format(new Date())}</Text>
            <Text style={styles.title}>Streakly</Text>
          </View>
          <Pressable
            style={styles.addBtn}
            onPress={() => navigation.navigate("NewHabit")}
            hitSlop={8}
          >
            <Ionicons name="add" size={26} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroStat}>
            <Text style={styles.heroNumber}>{stats.doneToday}/{stats.total}</Text>
            <Text style={styles.heroLabel}>done today</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <View style={styles.flameRow}>
              <Ionicons name="flame" size={20} color={colors.flame} />
              <Text style={styles.heroNumber}>{stats.bestStreak}</Text>
            </View>
            <Text style={styles.heroLabel}>best streak</Text>
          </View>
        </View>

        {habits.length === 0 ? (
          <EmptyState
            icon="flame-outline"
            title="No habits yet"
            subtitle="Tap the + button to start your first streak."
          />
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(h) => h.id}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + 24 }}
            renderItem={({ item }) => (
              <HabitRow
                habit={item}
                onToggle={() => toggleToday(item.id)}
                onPress={() => navigation.navigate("HabitDetail", { id: item.id })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  eyebrow: { ...type.caption, color: colors.mutedText, textTransform: "uppercase" },
  title: { ...type.display, color: colors.text, marginTop: 2 },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.floating,
  },
  heroCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  heroStat: { flex: 1, alignItems: "center" },
  heroDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  heroNumber: { ...type.title, color: colors.text },
  heroLabel: { ...type.caption, color: colors.mutedText, marginTop: 4, textTransform: "uppercase" },
  flameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
});
