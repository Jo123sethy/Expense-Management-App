export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  accent: string;
};

export type ThemeMode = "light" | "dark";
