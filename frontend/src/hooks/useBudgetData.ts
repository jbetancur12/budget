import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import type { ItemData, PocketData, ChartData, ChartRow, ItemHandlers, ItemType } from '../types';

interface BudgetData {
  income: ItemData[];
  services: ItemData[];
  loans: ItemData[];
  variableExp: ItemData[];
  pockets: PocketData[];
  chartHistory: ChartRow[];
  loading: boolean;
  error: string | null;
}

function toChartRow(r: ChartData): ChartRow {
  return { mes: r.monthLabel, ingresos: r.totalIncome, gastos: r.totalExpenses };
}

function updateCategory(prev: BudgetData, category: string, items: ItemData[]): BudgetData {
  switch (category) {
    case 'income': return { ...prev, income: items };
    case 'services': return { ...prev, services: items };
    case 'loans': return { ...prev, loans: items };
    case 'variable': return { ...prev, variableExp: items };
    default: return prev;
  }
}

async function loadCategory(category: string, offset: number): Promise<ItemData[]> {
  return api.fetchItems(category, offset);
}

export function useBudgetData(monthOffset: number | null) {
  const [data, setData] = useState<BudgetData>({
    income: [],
    services: [],
    loans: [],
    variableExp: [],
    pockets: [],
    chartHistory: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async (offset: number) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [inc, svc, lns, varExp, pck, chart] = await Promise.all([
        api.fetchItems('income', offset),
        api.fetchItems('services', offset),
        api.fetchItems('loans', offset),
        api.fetchItems('variable', offset),
        api.fetchPockets(),
        api.fetchChartHistory(),
      ]);
      setData({
        income: inc,
        services: svc,
        loans: lns,
        variableExp: varExp,
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
    refresh(monthOffset);
  }, [monthOffset, refresh]);

  const makeHandlers = useCallback(
    (category: string, type: ItemType): ItemHandlers => {
      const offset = monthOffset ?? 0;
      return {
        onAmountChange: async (id: number, amount: number) => {
          await api.updateItem(id, { amount });
          const items = await loadCategory(category, offset);
          setData((prev) => updateCategory(prev, category, items));
        },
        onDelete: async (id: number) => {
          await api.deleteItem(id);
          const items = await loadCategory(category, offset);
          setData((prev) => updateCategory(prev, category, items));
        },
        onAdd: async (name: string, amount: number, date?: string) => {
          await api.createItem({ name, amount, type, category, monthOffset: offset, date });
          const items = await loadCategory(category, offset);
          setData((prev) => updateCategory(prev, category, items));
        },
      };
    },
    [monthOffset],
  );

  const incomeH = makeHandlers('income', 'Variable');
  const servicesH = makeHandlers('services', 'Fijo');
  const loansH = makeHandlers('loans', 'Fijo');
  const variableH = makeHandlers('variable', 'Variable');

  const updatePockets = useCallback(async () => {
    const pockets = await api.fetchPockets();
    setData((prev) => ({ ...prev, pockets }));
  }, []);

  return { ...data, incomeH, servicesH, loansH, variableH, updatePockets };
}
