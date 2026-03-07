export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food & Dining",
    icon: "🍜",
    color: "#C4622D",
    bg: "#FAE8DC",
  },
  {
    id: "transport",
    label: "Transport",
    icon: "🚌",
    color: "#7C9A82",
    bg: "#DCF0E2",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎭",
    color: "#7B6BA8",
    bg: "#EAE6F5",
  },
  {
    id: "bills",
    label: "Bills & Utilities",
    icon: "⚡",
    color: "#C9A84C",
    bg: "#FBF3DC",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "🛍️",
    color: "#C47C8A",
    bg: "#F5E0E4",
  },
  {
    id: "health",
    label: "Health",
    icon: "💊",
    color: "#5A9AAF",
    bg: "#DDF0F6",
  },
  {
    id: "income",
    label: "Income",
    icon: "💰",
    color: "#3D7A5A",
    bg: "#D6F0E2",
  },
  { id: "other", label: "Other", icon: "📦", color: "#888888", bg: "#EBEBEB" },
];

export const getCategoryById = (id: string): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

export const EXPENSE_CATEGORIES: Category[] = CATEGORIES.filter(
  (c) => c.id !== "income",
);

export const MONTHS: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
