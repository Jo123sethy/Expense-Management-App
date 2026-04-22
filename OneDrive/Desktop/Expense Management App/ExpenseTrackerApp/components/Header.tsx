import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemePalette } from "@/styles/globalStyles";
import { ThemeMode } from "@/constants/types";

type HeaderProps = {
  title: string;
  subtitle: string;
  theme: ThemePalette;
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export default function Header({ title, subtitle, theme, mode, onToggleTheme }: HeaderProps) {
  return (
    <View style={[styles.container, { borderColor: theme.border }]}>        
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>{subtitle}</Text>
      </View>
      <Pressable style={[styles.toggle, { backgroundColor: theme.card }]} onPress={onToggleTheme}>
        <Feather name={mode === "dark" ? "sun" : "moon"} size={18} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  titleBlock: {
    maxWidth: "82%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  toggle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
