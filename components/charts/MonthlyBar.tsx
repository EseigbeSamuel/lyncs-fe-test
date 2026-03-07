"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TooltipProps } from "recharts";
import { getLast6Months, formatCurrency, isSameMonth } from "@/lib/utils";
import { Transaction } from "@/types";

interface MonthlyBarProps {
  transactions: Transaction[];
}

interface ChartEntry {
  label: string;
  income: number;
  expenses: number;
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const label = payload?.[0]?.payload?.label;
  return (
    <div className="card px-3 py-2 text-sm">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-mono" style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value ?? 0)}
        </div>
      ))}
    </div>
  );
};

export default function MonthlyBar({ transactions }: MonthlyBarProps) {
  const months = getLast6Months();

  const data: ChartEntry[] = months.map(({ month, year, label }) => {
    const monthTxns = transactions.filter((t) =>
      isSameMonth(t.date, month, year),
    );
    const income = monthTxns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { label, income, expenses };
  });

  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "200ms" }}
    >
      <h2 className="font-display text-xl mb-4">6 month overview</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%" barGap={2}>
          <CartesianGrid
            vertical={false}
            stroke="#EDE8DC"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              fill: "#9A9082",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fill: "#B0A898",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatCurrency(v, true)}
            width={48}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#7C9A82"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#C4622D"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "#7C9A82" }}
          />
          <span className="text-xs font-mono text-muted">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "#C4622D" }}
          />
          <span className="text-xs font-mono text-muted">Expenses</span>
        </div>
      </div>
    </div>
  );
}
