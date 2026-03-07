"use client";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  accent?: string;
  delay?: number;
}

function StatCard({ label, value, sub, accent, delay = 0 }: StatCardProps) {
  return (
    <div
      className="card animate-slide-up p-6 flex flex-col gap-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "#9A9082" }}
      >
        {label}
      </span>
      <span
        className="font-display text-3xl mt-1"
        style={{ color: accent ?? "#0D0D0D" }}
      >
        {formatCurrency(value)}
      </span>
      {sub && (
        <span className="text-xs mt-1" style={{ color: "#B0A898" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

export default function SummaryCards({
  income,
  expenses,
  balance,
}: SummaryCardsProps) {
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 stagger">
      <StatCard
        label="Income"
        value={income}
        accent="#3D7A5A"
        sub="this month"
        delay={0}
      />
      <StatCard
        label="Expenses"
        value={expenses}
        accent="#C4622D"
        sub={`${income > 0 ? Math.round((expenses / income) * 100) : 0}% of income`}
        delay={60}
      />
      <StatCard
        label="Balance"
        value={balance}
        accent={balance >= 0 ? "#0D0D0D" : "#C4622D"}
        sub={
          balance >= 0
            ? `${savingsRate}% savings rate 🎉`
            : "over budget this month"
        }
        delay={120}
      />
    </div>
  );
}
