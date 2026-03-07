export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

// Record keyed by category id → budget limit
export type Budget = Record<string, number>;
