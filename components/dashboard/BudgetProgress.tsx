"use client";
import { useState } from "react";
import { getCategoryById, EXPENSE_CATEGORIES } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";
import { Budget } from "@/types";

interface BudgetRowProps {
  category: string;
  spent: number;
  limit: number;
  onSetBudget: (category: string, amount: number) => void;
}

function BudgetRow({ category, spent, limit, onSetBudget }: BudgetRowProps) {
  const cat = getCategoryById(category);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const over = spent > limit && limit > 0;
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(limit?.toString() ?? "");

  const handleSave = () => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) onSetBudget(category, num);
    setEditing(false);
  };

  return (
    <div className=" py-3 border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 w-36 shrink-0">
          <cat.icon size={18} color={cat.color} />

          <span className="text-sm font-medium truncate text-dark-text">
            {cat.label}
          </span>
        </div>

        <div className="flex-1">
          <div className="h-2 rounded-full bg-light-border">
            <div
              className="h-2 rounded-full progress-bar transition-all"
              style={{
                width: `${pct}%`,
                background: over ? "#C4622D" : cat.color,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span
              className={`text-xs font-mono text-muted ${over && "text-expense"}`}
            >
              {formatCurrency(spent)} {over && " over budject"}
            </span>
            {limit > 0 && (
              <span className="text-xs font-mono text-light">
                / {formatCurrency(limit)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setVal(limit?.toString() ?? "");
            setEditing(true);
          }}
          className="text-xs shrink-0 py-1 px-3 rounded-lg transition-colors text-muted bg-cream"
        >
          {limit > 0 ? "Edit" : "Set budget"}
        </button>
      </div>

      {editing && (
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-sm text-muted">₦</span>
          <input
            autoFocus
            className="input-field w-20 py-1 px-2 text-sm"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <button
            className="btn-primary py-1 px-3 text-xs"
            onClick={handleSave}
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}

interface BudgetProgressProps {
  expensesByCategory: Record<string, number>;
  budgets: Budget;
  onSetBudget: (category: string, amount: number) => void;
}

export default function BudgetProgress({
  expensesByCategory,
  budgets,
  onSetBudget,
}: BudgetProgressProps) {
  const categories = EXPENSE_CATEGORIES.filter(
    (c) => expensesByCategory[c.id] || budgets[c.id],
  );

  if (categories.length === 0) return null;

  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "240ms" }}
    >
      <h2 className="font-display text-xl mb-4">Budget Tracker</h2>
      <div>
        {categories.map((cat) => (
          <BudgetRow
            key={cat.id}
            category={cat.id}
            spent={expensesByCategory[cat.id] ?? 0}
            limit={budgets[cat.id] ?? 0}
            onSetBudget={onSetBudget}
          />
        ))}
      </div>
    </div>
  );
}
