import { create } from "zustand";
import { Transaction } from "@/types";

interface TransactionModalState {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  openAdd: () => void;
  openEdit: (transaction: Transaction) => void;
  close: () => void;
}

export const useTransactionModal = create<TransactionModalState>((set) => ({
  isOpen: false,
  editingTransaction: null,
  openAdd: () => set({ isOpen: true, editingTransaction: null }),
  openEdit: (transaction) =>
    set({ isOpen: true, editingTransaction: transaction }),
  close: () => set({ isOpen: false, editingTransaction: null }),
}));
