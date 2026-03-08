"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";
import type { LucideIcon } from "lucide-react";
import { getCategoryById } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";

interface SpendingDonutProps {
  expensesByCategory: Record<string, number>;
}

interface DonutEntry {
  name: string;
  value: number;
  fill: string;
  icon: LucideIcon;
  pct: number;
}

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as DonutEntry;
  const Icon = d.icon;
  return (
    <div className="card px-3 py-2">
      <span className="text-sm font-medium flex items-center gap-1.5">
        <Icon size={14} color={d.fill} />
        {d.name}
      </span>
      <div className="font-mono text-sm mt-0.5" style={{ color: d.fill }}>
        {formatCurrency(d.value)} <span className="text-light">({d.pct}%)</span>
      </div>
    </div>
  );
};

export default function SpendingDonut({
  expensesByCategory,
}: SpendingDonutProps) {
  const total = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);

  const data: DonutEntry[] = Object.entries(expensesByCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, value]) => {
      const c = getCategoryById(cat);
      return {
        name: c.label,
        value,
        fill: c.color,
        icon: c.icon,
        pct: Math.round((value / total) * 100),
      };
    });

  if (data.length === 0) {
    return (
      <div
        className="card p-6 flex items-center justify-center h-64 animate-slide-up"
        style={{ animationDelay: "180ms" }}
      >
        <p className="text-sm text-light">
          No expenses yet — add some transactions!
        </p>
      </div>
    );
  }

  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "180ms" }}
    >
      <h2 className="font-display text-xl mb-4">Where it goes</h2>
      <div className="md:flex w-full gap-6 items-center">
        <div style={{ width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 min-w-0">
          {data.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: d.fill }}
                  />
                  <Icon size={14} color={d.fill} className="shrink-0" />
                  <span className="text-sm truncate text-dark-text">
                    {d.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-light">{d.pct}%</span>
                  <span className="text-sm font-mono font-medium">
                    {formatCurrency(d.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
