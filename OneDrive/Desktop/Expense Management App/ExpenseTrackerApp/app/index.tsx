// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import { COLORS } from "../constants/colors";
// import { Expense } from "@/constants/types";
// import { useEffect } from "react";
// import { getExpenses } from "../storage/storage";
// import { useFocusEffect } from "expo-router";
// import { useCallback } from "react";

// export default function HomeScreen() {
//   const router = useRouter();
// const [expenses, setExpenses] = useState<Expense[]>([]);
// const [selectedCategory, setSelectedCategory] = useState("All");
//   const total = expenses.reduce((sum, e) => sum + e.amount, 0);
// useEffect(() => {
//   loadExpenses();
// }, []);
// useFocusEffect(
//   useCallback(() => {
//     loadExpenses();
//   }, [])
// );
// const loadExpenses = async () => {
//   const data = await getExpenses();
//   setExpenses(data);
// };
//   return (
//     <View style={styles.container}>
      
//       {/* Header */}
//       <Text style={styles.title}>💸 Expense Tracker</Text>
//       <Text style={styles.total}>₹ {total}</Text>

//       {/* Add Button */}
//      <TouchableOpacity
//   style={styles.button}
//   onPress={() => router.push("/add-expense")}
// >
//   <Text style={styles.buttonText}>+ Add Expense</Text>
// </TouchableOpacity>

//       {/* Expense List */}
//       <FlatList
//         data={expenses}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.amount}>₹ {item.amount}</Text>
//             <Text style={styles.category}>Food 🍔</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: COLORS.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: COLORS.text,
//   },
//   total: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginVertical: 10,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderRadius: 12,
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   amount: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   category: {
//     color: COLORS.gray,
//     marginTop: 5,
//   },
// });




import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { getExpenses } from "../storage/storage";
import { Expense } from "@/constants/types";
import { COLORS, SPACING, TYPOGRAPHY, GLASS } from "../styles/globalStyles";

export default function HomeScreen() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDark, setIsDark] = useState(false);
  const [goal, setGoal] = useState(1500);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    loadExpenses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  const percent = total / goal;

  const progressColor =
    percent > 1 ? "#EF4444" : percent > 0.8 ? "#F59E0B" : "#6366F1";

  const theme = isDark ? dark : light;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* 🌈 Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      {/* 🌙 Theme Toggle */}
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setIsDark(!isDark)}
      >
        <Text>{isDark ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>

      {/* 🧊 HERO CARD */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.subText, { color: theme.sub }]}>
          Monthly Budget
        </Text>

        <Text style={[styles.total, { color: theme.text }]}>
          ₹ {total}
        </Text>

        <Text style={{ color: progressColor }}>
          {percent > 1
            ? "Over budget!"
            : `Left ₹ ${goal - total}`}
        </Text>
      </View>

      {/* 📊 CATEGORY FILTER */}
      <View style={styles.filterRow}>
        {["All", "Food", "Travel", "Shopping"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              selectedCategory === cat && styles.activeChip,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={{
                color: selectedCategory === cat ? "#fff" : "#555",
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🧾 EXPENSE LIST */}
      <FlatList
        data={
          selectedCategory === "All"
            ? expenses
            : expenses.filter((e) => e.category === selectedCategory)
        }
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: theme.card }]}>
            <View>
              <Text style={{ color: theme.text, fontWeight: "600" }}>
                {item.category}
              </Text>
              <Text style={{ color: theme.sub }}>
                {item.note || "No note"}
              </Text>
            </View>

            <Text style={{ color: theme.text, fontWeight: "bold" }}>
              ₹ {item.amount}
            </Text>
          </View>
        )}
      />

      {/* ✨ FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-expense")}
      >
        <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================== 🎨 STYLES ================== */

const light = {
  bg: "#F5F7FB",
  card: "rgba(255,255,255,0.7)",
  text: "#111",
  sub: "#666",
};

const dark = {
  bg: "#0F172A",
  card: "rgba(30,41,59,0.6)",
  text: "#fff",
  sub: "#94A3B8",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  toggle: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },

  /* 🌈 Aurora blobs */
  blob1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "rgba(99,102,241,0.4)",
    top: -50,
    left: -50,
  },

  blob2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "rgba(236,72,153,0.3)",
    bottom: -100,
    right: -80,
  },

  /* 🧊 Glass Card */
  card: {
    padding: 20,
    borderRadius: 20,
    marginTop: 80,
    marginBottom: 20,
  },

  total: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },

  subText: {
    fontSize: 14,
  },

  /* 🧩 Category Chips */
  filterRow: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
    marginBottom: 10,
  },

  activeChip: {
    backgroundColor: "#6366F1",
  },

  /* 📄 Expense Card */
  item: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ✨ FAB */
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
});

