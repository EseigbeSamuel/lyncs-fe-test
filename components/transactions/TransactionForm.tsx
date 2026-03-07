"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { EXPENSE_CATEGORIES, getCategoryById } from "@/lib/categories";
import { Transaction, TransactionType } from "@/types";

interface FormState {
  type: TransactionType;
  category: string;
  amount: string;
  description: string;
  date: string;
}

const DEFAULT: FormState = {
  type: "expense",
  category: "food",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

interface TransactionFormProps {
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id">) => void;
  initial?: Transaction;
}

export default function TransactionForm({
  onClose,
  onSave,
  initial,
}: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          ...initial,
          amount: initial.amount.toString(),
          date: initial.date.split("T")[0],
        }
      : DEFAULT,
  );

  useEffect(() => {
    if (form.type === "income") {
      setForm((f) => ({ ...f, category: "income" }));
    } else if (form.category === "income") {
      setForm((f) => ({ ...f, category: "food" }));
    }
  }, [form.type]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount");
    if (!form.description.trim()) return alert("Please add a description");
    onSave({
      type: form.type,
      category: form.category,
      amount,
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
    });
    onClose();
  };

  const cats =
    form.type === "income"
      ? [{ id: "income", label: "Income", icon: "💰" }]
      : EXPENSE_CATEGORIES;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">
            {initial ? "Edit transaction" : "New transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Type toggle */}
        <div
          className="flex gap-2 p-1 rounded-xl mb-5"
          style={{ background: "#F5F0E8" }}
        >
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("type", t)}
              className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={
                form.type === t
                  ? {
                      background: "#0D0D0D",
                      color: "#F5F0E8",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }
                  : { color: "#9A9082" }
              }
            >
              {t === "expense" ? "↑ Expense" : "↓ Income"}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1.5"
            style={{ color: "#9A9082" }}
          >
            Amount
          </label>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono"
              style={{ color: "#9A9082" }}
            >
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="input-field pl-7"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1.5"
            style={{ color: "#9A9082" }}
          >
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {cats.map((cat) => {
              const catStyle = getCategoryById(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => set("category", cat.id)}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all text-xs"
                  style={
                    form.category === cat.id
                      ? {
                          background: catStyle.bg,
                          border: `1.5px solid ${catStyle.color}`,
                          color: catStyle.color,
                        }
                      : {
                          background: "#F8F5EF",
                          border: "1.5px solid #E0D8CC",
                          color: "#6A6058",
                        }
                  }
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span
                    className="leading-tight text-center"
                    style={{ fontSize: "11px" }}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1.5"
            style={{ color: "#9A9082" }}
          >
            Description
          </label>
          <input
            type="text"
            placeholder="What was this for?"
            className="input-field"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1.5"
            style={{ color: "#9A9082" }}
          >
            Date
          </label>
          <input
            type="date"
            className="input-field"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn-ghost flex-1" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            {initial ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
