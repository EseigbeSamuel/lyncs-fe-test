"use client";
import { useState, useEffect, useCallback } from "react";
import { storage, DemoBudgets } from "@/lib/storage";
import { Budget } from "@/types";

interface BudgetStatus {
  pct: number;
  over: boolean;
  limit: number;
  spent?: number;
}

export function useBudget() {
  const [budgets, setBudgets] = useState<Budget>({});

  useEffect(() => {
    const stored = storage.getBudgets();
    if (Object.keys(stored).length === 0) {
      storage.setBudgets(DemoBudgets);
      setBudgets(DemoBudgets);
    } else {
      setBudgets(stored);
    }
  }, []);

  const setBudget = useCallback(
    (category: string, amount: number): void => {
      const next: Budget = { ...budgets, [category]: amount };
      setBudgets(next);
      storage.setBudgets(next);
    },
    [budgets],
  );

  const getBudgetStatus = useCallback(
    (category: string, spent: number): BudgetStatus => {
      const limit = budgets[category];
      if (!limit) return { pct: 0, over: false, limit: 0 };
      const pct = Math.min((spent / limit) * 100, 100);
      return { pct, over: spent > limit, limit, spent };
    },
    [budgets],
  );

  return { budgets, setBudget, getBudgetStatus };
}
