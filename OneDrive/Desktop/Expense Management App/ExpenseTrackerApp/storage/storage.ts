import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense, Category } from "@/constants/types";

const EXPENSES_KEY = "AURORA_EXPENSES";
const BUDGET_KEY = "AURORA_BUDGET_GOAL";
const CATEGORY_KEY = "AURORA_CATEGORIES";

const defaultCategories: Category[] = [
  { id: "food", name: "Food", icon: "🍔", accent: "#F97316" },
  { id: "travel", name: "Travel", icon: "✈️", accent: "#38BDF8" },
  { id: "shopping", name: "Shopping", icon: "🛍️", accent: "#A855F7" },
  { id: "bills", name: "Bills", icon: "💡", accent: "#F59E0B" },
  { id: "health", name: "Health", icon: "❤️", accent: "#34D399" },
];

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await AsyncStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed loading expenses", error);
    return [];
  }
};

export const saveExpenses = async (expenses: Expense[]) => {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Failed saving expenses", error);
  }
};

export const getBudgetGoal = async (): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem(BUDGET_KEY);
    return data ? Number(JSON.parse(data)) : 4200;
  } catch (error) {
    console.error("Failed loading budget goal", error);
    return 4200;
  }
};

export const saveBudgetGoal = async (goal: number) => {
  try {
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(goal));
  } catch (error) {
    console.error("Failed saving budget goal", error);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(CATEGORY_KEY);
    return data ? JSON.parse(data) : defaultCategories;
  } catch (error) {
    console.error("Failed loading categories", error);
    return defaultCategories;
  }
};

export const saveCategories = async (categories: Category[]) => {
  try {
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Failed saving categories", error);
  }
};
