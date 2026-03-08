"use client";
import { useState, useEffect } from "react";
import { Wallet, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EXPENSE_CATEGORIES, getCategoryById } from "@/lib/categories";
import { Transaction, TransactionType } from "@/types";
import { useTransactionModal } from "@/store/useTransactionModal";

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

interface CatOption {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface TransactionFormProps {
  onSave: (data: Omit<Transaction, "id">) => void;
  onUpdate: (id: string, data: Omit<Transaction, "id">) => void;
}

export default function TransactionForm({
  onSave,
  onUpdate,
}: TransactionFormProps) {
  const { isOpen, editingTransaction, close } = useTransactionModal();
  const [form, setForm] = useState<FormState>(DEFAULT);

  useEffect(() => {
    if (isOpen) {
      setForm(
        editingTransaction
          ? {
              ...editingTransaction,
              amount: editingTransaction.amount.toString(),
              date: editingTransaction.date.split("T")[0],
            }
          : DEFAULT,
      );
    }
  }, [isOpen, editingTransaction]);

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
    const data = {
      type: form.type,
      category: form.category,
      amount,
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
    };
    if (editingTransaction) {
      onUpdate(editingTransaction.id, data);
    } else {
      onSave(data);
    }
    close();
  };

  const cats: CatOption[] =
    form.type === "income"
      ? [
          {
            id: "income",
            label: "Income",
            icon: Wallet,
            color: "#3D7A5A",
            bg: "#D6F0E2",
          },
        ]
      : EXPENSE_CATEGORIES;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(13,13,13,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="card w-full max-w-md animate-scale-in flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 pb-0 shrink-0">
          <h2 className="font-display text-2xl">
            {editingTransaction ? "Edit transaction" : "New transaction"}
          </h2>
          <button
            onClick={close}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="flex gap-2 p-1 rounded-xl bg-cream">
            {(["expense", "income"] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => set("type", t)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
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

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5 text-muted">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-sm font-mono text-muted">
                ₦
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="input-field pl-8"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5 text-muted">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cats.map((cat) => {
                const catStyle = getCategoryById(cat.id);
                const Icon = cat.icon;
                const isSelected = form.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => set("category", cat.id)}
                    className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-all"
                    style={
                      isSelected
                        ? {
                            background: catStyle.bg,
                            border: `1.5px solid ${catStyle.color}`,
                          }
                        : {
                            background: "#F8F5EF",
                            border: "1.5px solid #E0D8CC",
                          }
                    }
                  >
                    <Icon
                      size={18}
                      color={isSelected ? catStyle.color : "#9A9082"}
                    />
                    <span
                      className="leading-tight text-center font-medium"
                      style={{
                        fontSize: "11px",
                        color: isSelected ? catStyle.color : "#6A6058",
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5 text-muted">
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

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5 text-muted">
              Date
            </label>
            <input
              type="date"
              className="input-field"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 pt-0 shrink-0 flex gap-3">
          <button className="btn-ghost flex-1" onClick={close}>
            Cancel
          </button>
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            {editingTransaction ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
