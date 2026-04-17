import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { getExpenses, saveExpenses } from "../storage/storage";
import { useEffect } from "react";
import { getCategories, saveCategories } from "../storage/categoryStorage";


export default function AddExpense() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
const [categories, setCategories] = useState<string[]>([]);
const [showAddCategory, setShowAddCategory] = useState(false);
const [newCategory, setNewCategory] = useState("");
const [errors, setErrors] = useState<any>({});
const [category, setCategory] = useState("");   // ✅ ADD THIS
const [note, setNote] = useState(""); 
const handleSave = async () => {
  let newErrors: any = {};

  if (!amount) newErrors.amount = "Amount is required";
  if (!category) newErrors.category = "Category is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  const newExpense = {
    id: Date.now(),
    amount: Number(amount),
    category,
    note,
    date: new Date().toISOString(),
  };

  const existing = await getExpenses();
  const updated = [newExpense, ...existing];

  await saveExpenses(updated);

  router.back();
};
useEffect(() => {
  loadCategories();
}, []);

const loadCategories = async () => {
  const data = await getCategories();
  setCategories(data);
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

    <Text style={styles.label}>Amount *</Text>

<TextInput
  placeholder="Enter amount"
  keyboardType="numeric"
  value={amount}
  onChangeText={setAmount}
  style={styles.input}
/>

{errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

    <Text style={styles.label}>Category *</Text>

<View style={styles.dropdown}>
  {categories.map((cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryItem,
        category === cat && styles.selectedCategory,
      ]}
      onPress={() => setCategory(cat)}
    >
<Text style={{ color: category === cat ? "#fff" : "#000" }}>
  {cat}
</Text>
</TouchableOpacity>
  ))}

  <TouchableOpacity
    style={styles.addCategory}
    onPress={() => setShowAddCategory(true)}
  >
    <Text style={{ fontSize: 12 }}>➕</Text>
  </TouchableOpacity>
</View>

{errors.category && <Text style={styles.error}>{errors.category}</Text>}
{showAddCategory && (
  <View>
    <Text style={styles.label}>New Category *</Text>

    <TextInput
      value={newCategory}
      onChangeText={setNewCategory}
      style={styles.input}
      placeholder="Enter category"
    />

    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        if (!newCategory) return;

        const updated = [...categories, newCategory];
        setCategories(updated);
        await saveCategories(updated);

        setCategory(newCategory);
        setNewCategory("");
        setShowAddCategory(false);
      }}
    >
      <Text style={styles.buttonText}>Save Category</Text>
    </TouchableOpacity>
  </View>
)}
     <Text style={styles.label}>Note</Text>

<TextInput
  placeholder="Enter note"
  value={note}
  onChangeText={setNote}
  style={styles.input}
/>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  label: {
  marginBottom: 5,
  fontWeight: "600",
  color: "#374151",
},

error: {
  color: "red",
  marginBottom: 10,
},

dropdown: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 15,
},

categoryItem: {
  padding: 10,
  backgroundColor: "#eee",
  borderRadius: 8,
  marginRight: 8,
  marginBottom: 8,
},

selectedCategory: {
  backgroundColor: "#4F46E5",
},

addCategory: {
  padding: 10,
  borderWidth: 1,
  borderRadius: 12,
  height: 40,
  width: 40,
  justifyContent: "center",
  alignItems: "center",
},
});