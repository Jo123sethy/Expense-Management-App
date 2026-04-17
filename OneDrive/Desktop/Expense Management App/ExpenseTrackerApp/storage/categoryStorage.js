import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "CATEGORIES";

export const getCategories = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : ["Food", "Travel", "Shopping"];
};

export const saveCategories = async (categories) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(categories));
};