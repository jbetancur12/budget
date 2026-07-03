// ─── Domain types ────────────────────────────────────────────────────────────
export type Tab = 'dashboard' | 'transactions' | 'pockets' | 'debts';
export type CloseOption = 'next' | 'distribute';
export type ItemType = 'Fijo' | 'Variable';
export type ItemCategory = 'income' | 'services' | 'loans' | 'variable';
export type PocketIcon = 'Shield' | 'Plane' | 'TrendingUp' | 'BookOpen';
export type DistributeMode = 'amount' | 'percent';

// ─── Data shapes (from API) ───────────────────────────────────────────────────
export interface CategoryData {
  id: number;
  name: string;
  type: 'income' | 'expense';
  budget?: number | null;
}

export interface ItemData {
  id: number;
  name: string;
  amount: number;
  type: ItemType;
  category: CategoryData;
  monthOffset: number;
  date: string;
  recurring: boolean;
  notes?: string;
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

export interface DebtData {
  id: number;
  person: string;
  type: 'lent' | 'borrowed';
  originalAmount: number;
  remainingBalance: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  onDuplicate?: (id: number) => Promise<void>;
  onAdd: (
    name: string,
    amount: number,
    date?: string,
    recurring?: boolean,
    notes?: string,
  ) => Promise<void>;
  onRecurringToggle?: (id: number, recurring: boolean) => Promise<void>;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
  categoryId: number;
}
