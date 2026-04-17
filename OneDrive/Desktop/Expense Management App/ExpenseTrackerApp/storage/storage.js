import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "EXPENSES";

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(expenses));
  } catch (e) {
    console.log("Save error", e);
  }
};

export const getExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Fetch error", e);
    return [];
  }
};