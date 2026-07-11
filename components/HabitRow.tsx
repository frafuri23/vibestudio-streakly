import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "../lib/types";
import { calcStreaks } from "../lib/habits";
import { colors, radius, shadow, spacing, type } from "../lib/theme";

export default function HabitRow({
  habit,
  onToggle,
  onPress,
}: {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const { current, doneToday } = calcStreaks(habit.completedDates);

  const pressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.card}
      >
        <View style={[styles.iconWrap, { backgroundColor: habit.color + "22" }]}>
          <Ionicons name={habit.icon} size={22} color={habit.color} />
        </View>

        <View style={styles.middle}>
          <Text style={styles.name} numberOfLines={1}>
            {habit.name}
          </Text>
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={14} color={current > 0 ? colors.flame : colors.mutedText} />
            <Text style={[styles.streakText, { color: current > 0 ? colors.flame : colors.mutedText }]}>
              {current} day{current === 1 ? "" : "s"} streak
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onToggle}
          hitSlop={10}
          style={[
            styles.check,
            {
              backgroundColor: doneToday ? habit.color : colors.background,
              borderColor: doneToday ? habit.color : colors.border,
            },
          ]}
        >
          {doneToday ? <Ionicons name="checkmark" size={20} color="#fff" /> : null}
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  middle: { flex: 1, minWidth: 0 },
  name: { ...type.heading, color: colors.text },
  streakRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 5 },
  streakText: { fontSize: 12.5, fontWeight: "700" },
  check: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
});
