import { StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { Expense } from "@/constants/types";
import { ThemePalette } from "@/styles/globalStyles";

type ExpenseCardProps = {
  expense: Expense;
  theme: ThemePalette;
  onDelete: (id: string) => void;
};

export default function ExpenseCard({ expense, theme, onDelete }: ExpenseCardProps) {
  const renderRightAction = () => (
    <RectButton style={[styles.swipeAction, { backgroundColor: theme.danger }]} onPress={() => onDelete(expense.id)}>
      <Text style={styles.actionText}>Delete</Text>
    </RectButton>
  );

  return (
    <Swipeable renderRightActions={renderRightAction} overshootRight={false}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>        
        <View>
          <Text style={[styles.category, { color: theme.primary }]}>{expense.category}</Text>
          <Text style={[styles.note, { color: theme.subText }]} numberOfLines={1}>
            {expense.note || "No note provided"}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.amount, { color: theme.text }]}>₹ {expense.amount.toFixed(0)}</Text>
          <Text style={[styles.date, { color: theme.subText }]}>{expense.date}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  category: {
    fontSize: 16,
    fontWeight: "700",
  },
  note: {
    marginTop: 4,
    fontSize: 13,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
  date: {
    marginTop: 6,
    fontSize: 12,
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
