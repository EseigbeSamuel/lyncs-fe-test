"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getCategoryById } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { useTransactionModal } from "@/store/useTransactionModal";

interface TxnRowProps {
  txn: Transaction;
  onDelete: (id: string) => void;
}

function TxnRow({ txn, onDelete }: TxnRowProps) {
  const cat = getCategoryById(txn.category);
  const Icon = cat.icon;
  const isIncome = txn.type === "income";
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { openEdit } = useTransactionModal();

  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-stone-100 last:border-0 group">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cat.bg }}
      >
        <Icon size={16} color={cat.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-darker">
              {txn.description}
            </p>
            <p className="text-xs mt-0.5 font-mono text-light">
              {cat.label} · {formatDate(txn.date)}
            </p>
          </div>
          <span
            className={`font-mono font-medium text-sm shrink-0 ${isIncome ? "text-income" : "text-expense"}`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(txn.amount)}
          </span>
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => openEdit(txn)}
          className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <Pencil size={13} className="text-muted" />
        </button>
        {confirmDelete ? (
          <button
            onClick={() => onDelete(txn.id)}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-[#C4622D] text-white"
          >
            Sure?
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} className="text-muted" />
          </button>
        )}
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const visible = showAll ? sorted : sorted.slice(0, 8);

  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Recent transactions</h2>
        <span className="text-xs font-mono px-2 py-1 rounded-full bg-cream text-muted">
          {transactions.length} total
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm py-6 text-center text-light">
          No transactions this month yet.
        </p>
      ) : (
        <>
          <div>
            {visible.map((txn) => (
              <TxnRow key={txn.id} txn={txn} onDelete={onDelete} />
            ))}
          </div>
          {sorted.length > 8 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full mt-3 py-2 text-sm rounded-xl transition-colors text-income bg-cream"
            >
              {showAll ? "Show less" : `Show all ${sorted.length} transactions`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
