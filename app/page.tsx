"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { getCurrentMonthName } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransaction";
import { useTransactionModal } from "@/store/useTransactionModal";
import SummaryCards from "@/components/dashboard/SummaryCard";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/transactions/TransactionForm";

const SpendingDonut = dynamic(
  () => import("@/components/charts/SpendingDounut"),
  { ssr: false },
);
const MonthlyBar = dynamic(() => import("@/components/charts/MonthlyBar"), {
  ssr: false,
});

export default function Home() {
  const {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    getExpensesByCategory,
  } = useTransactions();

  const { budgets, setBudget } = useBudget();
  const { openAdd } = useTransactionModal();

  const now = new Date();
  const {
    income,
    expenses,
    balance,
    transactions: monthTxns,
  } = getMonthlyStats(now.getMonth(), now.getFullYear());
  const expensesByCategory = getExpensesByCategory(
    now.getMonth(),
    now.getFullYear(),
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-2xl text-light">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(245,240,232,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto px-3 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl leading-none">
              Finance Snapshot
            </h1>
            <p className="text-xs font-mono mt-1 text-muted">
              {getCurrentMonthName()}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={2} />
            Add transaction
          </button>
        </div>
      </header>

      <main className="max-w-5xl px-3 mx-auto md:px-6 py-8 space-y-6">
        <SummaryCards income={income} expenses={expenses} balance={balance} />

        <div className="grid lg:grid-cols-2 gap-4">
          <SpendingDonut expensesByCategory={expensesByCategory} />
          <MonthlyBar transactions={transactions} />
        </div>

        <BudgetProgress
          expensesByCategory={expensesByCategory}
          budgets={budgets}
          onSetBudget={setBudget}
        />

        <TransactionList
          transactions={monthTxns}
          onDelete={deleteTransaction}
        />
      </main>

      <footer className="text-center py-8">
        <p className="text-xs font-mono text-light">
          Finance Snapshot — your money, at a glance
        </p>
      </footer>

      <TransactionForm onSave={addTransaction} onUpdate={updateTransaction} />
    </div>
  );
}
