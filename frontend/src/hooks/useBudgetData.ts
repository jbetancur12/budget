import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import type { ItemData, CategoryData, PocketData, ChartData, ChartRow, ItemHandlers, ItemType } from '../types';

interface BudgetData {
  categories: CategoryData[];
  incomeCategories: CategoryData[];
  expenseCategories: CategoryData[];
  itemsByCategory: Record<number, ItemData[]>;
  pockets: PocketData[];
  chartHistory: ChartRow[];
  loading: boolean;
  error: string | null;
}

function toChartRow(r: ChartData): ChartRow {
  return { mes: r.monthLabel, ingresos: r.totalIncome, gastos: r.totalExpenses };
}

export function useBudgetData(monthOffset: number | null) {
  const [data, setData] = useState<BudgetData>({
    categories: [],
    incomeCategories: [],
    expenseCategories: [],
    itemsByCategory: {},
    pockets: [],
    chartHistory: [],
    loading: true,
    error: null,
  });
  const [search, setSearch] = useState('');

  const refresh = useCallback(async (offset: number, searchTerm?: string) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [allItems, categories, pck, chart] = await Promise.all([
        api.fetchItems(offset, searchTerm),
        api.fetchCategories(),
        api.fetchPockets(),
        api.fetchChartHistory(),
      ]);

      const itemsByCategory: Record<number, ItemData[]> = {};
      for (const item of allItems) {
        const catId = item.category.id;
        if (!itemsByCategory[catId]) itemsByCategory[catId] = [];
        itemsByCategory[catId].push(item);
      }

      setData({
        categories,
        incomeCategories: categories.filter((c) => c.type === 'income'),
        expenseCategories: categories.filter((c) => c.type === 'expense'),
        itemsByCategory,
        pockets: pck,
        chartHistory: chart.map(toChartRow),
        loading: false,
        error: null,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load data',
      }));
    }
  }, []);

  useEffect(() => {
    if (monthOffset === null) return;
    refresh(monthOffset, search || undefined);
  }, [monthOffset, search, refresh]);

  const makeHandlers = useCallback(
    (catId: number, type: ItemType): ItemHandlers => {
      const offset = monthOffset ?? 0;
      return {
        categoryId: catId,
        onAmountChange: async (id: number, amount: number) => {
          await api.updateItem(id, { amount });
          refresh(offset, search || undefined);
        },
        onNameChange: async (id: number, name: string) => {
          await api.updateItem(id, { name });
          refresh(offset, search || undefined);
        },
        onDateChange: async (id: number, date: string) => {
          await api.updateItem(id, { date });
          refresh(offset, search || undefined);
        },
        onDelete: async (id: number) => {
          await api.deleteItem(id);
          refresh(offset, search || undefined);
        },
        onAdd: async (name: string, amount: number, date?: string, recurring?: boolean) => {
          await api.createItem({ name, amount, type, categoryId: catId, monthOffset: offset, date, recurring });
          refresh(offset, search || undefined);
        },
        onRecurringToggle: async (id: number, recurring: boolean) => {
          await api.updateItem(id, { recurring });
          refresh(offset, search || undefined);
        },
      };
    },
    [monthOffset, search, refresh],
  );

  const updatePockets = useCallback(async () => {
    const pockets = await api.fetchPockets();
    setData((prev) => ({ ...prev, pockets }));
  }, []);

  return { ...data, search, setSearch, makeHandlers, updatePockets };
}
