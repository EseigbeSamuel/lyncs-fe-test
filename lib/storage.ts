import { Transaction, Budget } from "@/types";

const TRANSACTIONS_KEY = "fs_transactions";
const BUDGETS_KEY = "fs_budgets";

export const storage = {
  getTransactions(): Transaction[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        localStorage.getItem(TRANSACTIONS_KEY) || "[]",
      ) as Transaction[];
    } catch {
      return [];
    }
  },
  setTransactions(txns: Transaction[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
  },
  getBudgets(): Budget {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(BUDGETS_KEY) || "{}") as Budget;
    } catch {
      return {};
    }
  },
  setBudgets(budgets: Budget): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  },
};

export const DemoTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "income",
    amount: 4500,
    description: "Monthly salary",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    ).toISOString(),
  },
  {
    id: "2",
    type: "income",
    category: "income",
    amount: 800,
    description: "Freelance project",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      5,
    ).toISOString(),
  },
  {
    id: "3",
    type: "expense",
    category: "food",
    amount: 320,
    description: "Groceries & dining",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      7,
    ).toISOString(),
  },
  {
    id: "4",
    type: "expense",
    category: "bills",
    amount: 180,
    description: "Rent & electricity",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      3,
    ).toISOString(),
  },
  {
    id: "5",
    type: "expense",
    category: "transport",
    amount: 95,
    description: "Monthly transit pass",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      2,
    ).toISOString(),
  },
  {
    id: "6",
    type: "expense",
    category: "entertainment",
    amount: 65,
    description: "Cinema & streaming",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      9,
    ).toISOString(),
  },
  {
    id: "7",
    type: "expense",
    category: "shopping",
    amount: 210,
    description: "Clothes & misc",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      11,
    ).toISOString(),
  },
  {
    id: "8",
    type: "expense",
    category: "health",
    amount: 45,
    description: "Pharmacy",
    date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      14,
    ).toISOString(),
  },
];

export const DemoBudgets: Budget = {
  food: 500,
  transport: 150,
  entertainment: 100,
  bills: 400,
  shopping: 300,
  health: 100,
};
