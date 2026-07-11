import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHabitStore } from "../lib/store";
import { colors, radius, shadow, spacing, type } from "../lib/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const habits = useHabitStore((s) => s.habits);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const [confirmReset, setConfirmReset] = useState(false);

  const resetAll = () => {
    habits.forEach((h) => removeHabit(h.id));
    setConfirmReset(false);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: colors.accentTint }]}>
                <Ionicons name="list-outline" size={18} color={colors.accent} />
              </View>
              <Text style={styles.rowLabel}>Active habits</Text>
            </View>
            <Text style={styles.rowValue}>{habits.length}</Text>
          </View>
        </View>

        <Pressable style={styles.dangerCard} onPress={() => setConfirmReset(true)}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.dangerText}>Reset all data</Text>
        </Pressable>

        <Text style={styles.footerNote}>Streakly stores your habits locally on this device.</Text>
      </View>

      {confirmReset && (
        <View style={styles.overlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Reset all data?</Text>
            <Text style={styles.confirmSubtitle}>This deletes every habit and streak. This can't be undone.</Text>
            <View style={styles.confirmRow}>
              <Pressable style={[styles.confirmBtn, styles.cancelBtn]} onPress={() => setConfirmReset(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.confirmBtn, styles.deleteBtn]} onPress={resetAll}>
                <Text style={styles.deleteText}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  title: { ...type.display, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowIcon: { width: 34, height: 34, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  rowLabel: { ...type.body, color: colors.text },
  rowValue: { ...type.body, color: colors.mutedText },
  dangerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.dangerTint,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  dangerText: { ...type.body, color: colors.danger, fontWeight: "700" },
  footerNote: { ...type.caption, color: colors.mutedText, textAlign: "center", fontWeight: "500" },
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
