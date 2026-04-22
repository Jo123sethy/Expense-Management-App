import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemePalette } from "@/styles/globalStyles";

type CategoryChipProps = {
  title: string;
  icon: string;
  accent: string;
  selected?: boolean;
  theme: ThemePalette;
  onPress: () => void;
};

export default function CategoryChip({ title, icon, accent, selected = false, theme, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: selected ? accent : theme.card, borderColor: selected ? accent : theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.icon, { color: selected ? "#fff" : accent }]}>{icon}</Text>
      <Text style={[styles.label, { color: selected ? "#fff" : theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
