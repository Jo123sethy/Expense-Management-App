import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useFonts as useSoraFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold } from "@expo-google-fonts/sora";
import { useFonts as useManropeFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from "@expo-google-fonts/manrope";

import Header from "../components/Header";
import BudgetRing from "../components/BudgetRing";
import CategoryChip from "../components/CategoryChip";
import ExpenseCard from "../components/ExpenseCard";
import { getBudgetGoal, getCategories, getExpenses, saveExpenses } from "../storage/storage";
import { Expense, Category, ThemeMode } from "@/constants/types";
import { DARK_THEME, LIGHT_THEME } from "../styles/globalStyles";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "all", name: "All", icon: "✨", accent: "#818CF8" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [goal, setGoal] = useState(4200);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const [soraLoaded] = useSoraFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
  });
  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  const theme = themeMode === "dark" ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [expenseData, categoryData, budgetGoal] = await Promise.all([
      getExpenses(),
      getCategories(),
      getBudgetGoal(),
    ]);

    setExpenses(expenseData);
    setCategoryList([{ id: "all", name: "All", icon: "✨", accent: theme.primary }, ...categoryData]);
    setGoal(budgetGoal);
  };

  const handleDelete = async (id: string) => {
    const filtered = expenses.filter((expense) => expense.id !== id);
    await saveExpenses(filtered);
    setExpenses(filtered);
  };

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const progress = Math.min(total / Math.max(goal, 1), 1);
  const overBudget = total > goal;
  const progressColor = overBudget ? theme.danger : progress >= 0.8 ? theme.warning : theme.primary;

  const filteredExpenses = useMemo(
    () =>
      selectedCategory === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === selectedCategory),
    [expenses, selectedCategory]
  );

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(daysInMonth - today.getDate(), 1);
  const dailyTarget = Math.max(Math.round((goal - total) / daysLeft), 0);

  if (!soraLoaded || !manropeLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>      
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      <View style={StyleSheet.absoluteFill}>        
        <View style={[styles.blob, styles.blobLeft, { backgroundColor: theme.gradientA }]} />
        <View style={[styles.blob, styles.blobRight, { backgroundColor: theme.gradientB }]} />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header
          title="Aurora Expense Tracker"
          subtitle="Premium glass finance dashboard"
          theme={theme}
          mode={themeMode}
          onToggleTheme={() => setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))}
        />

        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>          
          <View style={styles.heroContent}>
            <View>
              <Text style={[styles.heroLabel, { color: theme.subText }]}>Monthly balance</Text>
              <Text style={[styles.heroTitle, { color: theme.text }]}>₹ {total.toFixed(0)}</Text>
              <Text style={[styles.heroCaption, { color: progressColor }]}>
                {overBudget ? "Over budget" : `₹ ${goal - total} left`} • {dailyTarget} / day
              </Text>
            </View>
            <BudgetRing progress={progress} theme={theme} color={progressColor} />
          </View>
          <View style={[styles.progressBadge, { backgroundColor: progressColor }]}>            
            <Text style={styles.progressBadgeText}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Filter by category</Text>
          <View style={styles.chipRow}>
            {categoryList.map((item) => (
              <CategoryChip
                key={item.id}
                title={item.name}
                icon={item.icon}
                accent={item.accent}
                selected={selectedCategory === item.name}
                theme={theme}
                onPress={() => setSelectedCategory(item.name)}
              />
            ))}
          </View>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent expenses</Text>
            <Text style={[styles.sectionMeta, { color: theme.subText }]}>{filteredExpenses.length} records</Text>
          </View>
          {filteredExpenses.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>              
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No expenses yet</Text>
              <Text style={[styles.emptyText, { color: theme.subText }]}>Add your first aurora expense to see a premium summary.</Text>
            </View>
          ) : (
            filteredExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} theme={theme} onDelete={handleDelete} />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => router.push("/add-expense")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  blob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 200,
    opacity: 0.22,
    transform: [{ scale: 1.2 }],
  },
  blobLeft: {
    top: -60,
    left: -80,
  },
  blobRight: {
    top: 80,
    right: -90,
  },
  heroCard: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    marginBottom: 22,
    overflow: "hidden",
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 14,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 34,
    lineHeight: 44,
  },
  heroCaption: {
    marginTop: 10,
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
  },
  progressBadge: {
    position: "absolute",
    right: 20,
    bottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  progressBadgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  categorySection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 18,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listSection: {
    marginTop: 12,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionMeta: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
  },
  emptyState: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    fontFamily: "Sora_600SemiBold",
    fontSize: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    right: 24,
    bottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  fabText: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "700",
  },
});
