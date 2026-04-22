import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts as useSoraFonts, Sora_400Regular, Sora_500Medium, Sora_600SemiBold } from "@expo-google-fonts/sora";
import { useFonts as useManropeFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from "@expo-google-fonts/manrope";

import CategoryChip from "../components/CategoryChip";
import { getCategories, getExpenses, getBudgetGoal, saveBudgetGoal, saveCategories, saveExpenses } from "../storage/storage";
import { Category, Expense, ThemeMode } from "@/constants/types";
import { DARK_THEME, LIGHT_THEME } from "../styles/globalStyles";

const accentPalette = ["#8B5CF6", "#3B82F6", "#F97316", "#34D399", "#F43F5E"];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(formatDate(new Date()));
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [budgetGoal, setBudgetGoal] = useState(4200);
  const [budgetInput, setBudgetInput] = useState("4200");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const params = useLocalSearchParams();
  const paramThemeMode = (params.themeMode as ThemeMode) || 'dark';
  const themeMode = paramThemeMode;
  const theme = themeMode === "dark" ? DARK_THEME : LIGHT_THEME;

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

  useEffect(() => {
    const editingStr = params.editingExpense as string;
    if (editingStr) {
      try {
        const parsed = JSON.parse(editingStr);
        setEditingExpense(parsed);
        setAmount(String(parsed.amount));
        setNote(parsed.note || '');
        setCategory(parsed.category);
        setDate(parsed.date);
      } catch (e) {
        console.error('Failed to parse editingExpense', e);
      }
    }
  }, [params.editingExpense]);

  useEffect(() => {
    if (editingExpense) return; // Skip if editing, category already set
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [savedCategories, savedGoal] = await Promise.all([getCategories(), getBudgetGoal()]);
    setCategories(savedCategories);
    setBudgetGoal(savedGoal);
    setBudgetInput(String(savedGoal));
    const defaultCat = savedCategories[0]?.name ?? "Food";
    if (!editingExpense) {
      setCategory(defaultCat);
    }
  };

  const handleSaveExpense = async () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }

    const updatedExpense: Expense = {
      ...(editingExpense || { id: `${Date.now()}` }),
      amount: Number(amount),
      category,
      note: note || '',
      date,
    };

    const existing = await getExpenses();
    const updatedExpenses = editingExpense 
      ? existing.map(e => e.id === editingExpense.id ? updatedExpense : e)
      : [updatedExpense, ...existing];
    await saveExpenses(updatedExpenses);
    router.back();
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const accent = accentPalette[Math.floor(Math.random() * accentPalette.length)];
    const nextCategory: Category = {
      id: trimmed.toLowerCase().replace(/\s+/g, "-"),
      name: trimmed,
      icon: "⭐",
      accent,
    };
    const updated = [...categories, nextCategory];
    await saveCategories(updated);
    setCategories(updated);
    setCategory(trimmed);
    setNewCategory("");
  };

  const handleBudgetUpdate = async () => {
    const value = Number(budgetInput);
    if (value <= 0) return;
    await saveBudgetGoal(value);
    setBudgetGoal(value);
  };

  const calendarOptions = Array.from({ length: 7 }).map((_, index) => {
    const next = new Date();
    next.setDate(next.getDate() + index);
    return formatDate(next);
  });

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
   <KeyboardAvoidingView
  style={styles.wrapper}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
    <View style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>         
          <View style={styles.handle} />
          <Text style={[styles.heading, { color: theme.text }]}>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Capture spend details, category, and target budget.</Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.subText }]}>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="₹ 0"
              placeholderTextColor={theme.subText}
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.subText }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPicker}>
              {categories.map((item) => (
                <CategoryChip
                  key={item.id}
                  title={item.name}
                  icon={item.icon}
                  accent={item.accent}
                  selected={category === item.name}
                  theme={theme}
                  onPress={() => setCategory(item.name)}
                />
              ))}
              {/* <TouchableOpacity
                style={[styles.addCategory, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setNewCategory("")}
              >
                <Text style={[styles.addText, { color: theme.primary }]}>+ Add</Text>
              </TouchableOpacity> */}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.subText }]}>Date</Text>
            <TouchableOpacity style={[styles.input, styles.dateInput, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => setShowDateMenu((prev) => !prev)}>
              <Text style={[styles.dateText, { color: theme.text }]}>{date}</Text>
            </TouchableOpacity>
            {showDateMenu && (
              <View style={[styles.dateMenu, { backgroundColor: theme.surface, borderColor: theme.border }]}>                
                {calendarOptions.map((option) => (
                  <TouchableOpacity key={option} onPress={() => { setDate(option); setShowDateMenu(false); }} style={styles.dateOption}>
                    <Text style={[styles.dateOptionText, { color: theme.text }]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.subText }]}>Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Coffee, groceries, travel..."
              placeholderTextColor={theme.subText}
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              multiline
            />
          </View>

          <View style={styles.row}>            
            <View style={[styles.budgetCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>              
              <Text style={[styles.fieldLabel, { color: theme.subText }]}>Monthly goal</Text>
              <Text style={[styles.currentGoal, { color: theme.text }]}>Current goal: ₹ {budgetGoal}</Text>
              <TextInput
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                placeholder="4200"
                placeholderTextColor={theme.subText}
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border, paddingHorizontal: 12 }]}
              />
            </View>
            <TouchableOpacity style={[styles.styledButton, { backgroundColor: theme.primary }]} onPress={handleBudgetUpdate}>
              <Text style={styles.styledButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.subText }]}>Create new category</Text>
            <View style={styles.row}>              
              <TextInput
                value={newCategory}
                onChangeText={setNewCategory}
                placeholder="Enter category name"
                placeholderTextColor={theme.subText}
                style={[styles.input, { flex: 1, backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAddCategory}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {editingExpense && (
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.danger, marginBottom: 12 }]} onPress={() => router.back()}>
              <Text style={[styles.saveButtonText, { color: '#fff' }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSaveExpense}>
            <Text style={styles.saveButtonText}>{editingExpense ? 'Update Expense' : 'Save Expense'}</Text>
          </TouchableOpacity>
           </View>
  </ScrollView>
</KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    top:38,
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.92)",
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 1,
  },
  handle: {
    width: 64,
    height: 6,
    // backgroundColor: "rgba(155, 50, 50, 0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 18,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 22,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 10,
  },
  currentGoal: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryPicker: {
    flexDirection: "row",
    alignItems: "center",
  },
  addCategory: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 4,
  },
  addText: {
    fontWeight: "700",
  },
  dateInput: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 15,
  },
  dateMenu: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  dateOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dateOptionText: {
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  budgetCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
  },
  styledButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  styledButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  addButton: {
    marginLeft: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
