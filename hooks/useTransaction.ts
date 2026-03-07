"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { storage, DemoTransactions } from "@/lib/storage";
import { isSameMonth } from "@/lib/utils";
import { Transaction, TransactionType } from "@/types";

interface MonthlyStats {
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = storage.getTransactions();
    if (stored.length === 0) {
      storage.setTransactions(DemoTransactions);
      setTransactions(DemoTransactions);
    } else {
      setTransactions(stored);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((txns: Transaction[]) => {
    setTransactions(txns);
    storage.setTransactions(txns);
  }, []);

  const addTransaction = useCallback(
    (data: Omit<Transaction, "id">): Transaction => {
      const txn: Transaction = { ...data, id: uuidv4() };
      persist([txn, ...transactions]);
      return txn;
    },
    [transactions, persist],
  );

  const updateTransaction = useCallback(
    (id: string, data: Omit<Transaction, "id">): void => {
      persist(transactions.map((t) => (t.id === id ? { ...t, ...data } : t)));
    },
    [transactions, persist],
  );

  const deleteTransaction = useCallback(
    (id: string): void => {
      persist(transactions.filter((t) => t.id !== id));
    },
    [transactions, persist],
  );

  const getMonthlyStats = useCallback(
    (month: number, year: number): MonthlyStats => {
      const monthTxns = transactions.filter((t) =>
        isSameMonth(t.date, month, year),
      );
      const income = monthTxns
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expenses = monthTxns
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return {
        income,
        expenses,
        balance: income - expenses,
        transactions: monthTxns,
      };
    },
    [transactions],
  );

  const getExpensesByCategory = useCallback(
    (month: number, year: number): Record<string, number> => {
      const monthTxns = transactions.filter(
        (t) => isSameMonth(t.date, month, year) && t.type === "expense",
      );
      return monthTxns.reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {});
    },
    [transactions],
  );

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    getExpensesByCategory,
  };
}
