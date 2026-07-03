// ─── Domain types ────────────────────────────────────────────────────────────
export type Tab = 'dashboard' | 'transactions' | 'pockets';
export type CloseOption = 'next' | 'distribute';
export type ItemType = 'Fijo' | 'Variable';
export type ItemCategory = 'income' | 'services' | 'loans' | 'variable';
export type PocketIcon = 'Shield' | 'Plane' | 'TrendingUp' | 'BookOpen';
export type DistributeMode = 'amount' | 'percent';

// ─── Data shapes (from API) ───────────────────────────────────────────────────
export interface ItemData {
  id: number;
  name: string;
  amount: number;
  type: ItemType;
  category: ItemCategory;
  monthOffset: number;
  date: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PocketData {
  id: number;
  name: string;
  balance: number;
  goal: number;
  color: string;
  icon: PocketIcon;
  createdAt: string;
  updatedAt: string;
}

export interface ChartData {
  id: number;
  monthOffset: number;
  monthLabel: string;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

// ─── UI types ─────────────────────────────────────────────────────────────────
export interface ChartRow {
  mes: string;
  ingresos: number;
  gastos: number;
}

export interface ItemHandlers {
  onAmountChange: (id: number, amount: number) => Promise<void>;
  onNameChange: (id: number, name: string) => Promise<void>;
  onDateChange: (id: number, date: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAdd: (name: string, amount: number, date?: string, recurring?: boolean) => Promise<void>;
  onRecurringToggle?: (id: number, recurring: boolean) => Promise<void>;
}
