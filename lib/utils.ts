export interface MonthEntry {
  month: number;
  year: number;
  label: string;
}

export const formatCurrency = (
  amount: number,
  compact: boolean = false,
): string => {
  if (compact && Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getCurrentMonthName = (): string =>
  new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

export const isSameMonth = (
  dateStr: string,
  month: number,
  year: number,
): boolean => {
  const d = new Date(dateStr);
  return d.getMonth() === month && d.getFullYear() === year;
};

export const getLast6Months = (): MonthEntry[] => {
  const result: MonthEntry[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      month: d.getMonth(),
      year: d.getFullYear(),
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return result;
};
