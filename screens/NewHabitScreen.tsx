import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useHabitStore } from "../lib/store";
import { colors, HABIT_COLORS, HABIT_ICONS, radius, shadow, spacing, type } from "../lib/theme";

export default function NewHabitScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const addHabit = useHabitStore((s) => s.addHabit);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(HABIT_ICONS[0]);
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    addHabit(name, icon, color);
    navigation.goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>New Habit</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.preview, { backgroundColor: color + "22" }]}>
          <Ionicons name={icon as any} size={34} color={color} />
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Drink water"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          autoFocus
        />

        <Text style={styles.label}>Icon</Text>
        <View style={styles.grid}>
          {HABIT_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => setIcon(ic)}
              style={[
                styles.gridItem,
                icon === ic && { borderColor: color, backgroundColor: color + "18" },
              ]}
            >
              <Ionicons name={ic as any} size={20} color={icon === ic ? color : colors.mutedText} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {HABIT_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          onPress={save}
          disabled={!canSave}
          style={[styles.saveBtn, { backgroundColor: canSave ? colors.accent : colors.border }]}
        >
          <Text style={[styles.saveText, { color: canSave ? "#fff" : colors.mutedText }]}>Create Habit</Text>
        </Pressable>
      </View>
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
    paddingVertical: spacing.md,
  },
  closeBtn: { width: 24 },
  headerTitle: { ...type.heading, color: colors.text },
  body: { flex: 1, paddingHorizontal: spacing.lg },
  preview: {
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  label: { ...type.caption, color: colors.mutedText, textTransform: "uppercase", marginBottom: spacing.sm, marginTop: spacing.lg },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gridItem: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotActive: { borderWidth: 3, borderColor: colors.text },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  saveBtn: {
    height: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.floating,
  },
  saveText: { ...type.heading },
});
