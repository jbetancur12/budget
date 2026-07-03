import { request } from './client';
import type { DebtData } from '../types';

export async function fetchDebts(): Promise<DebtData[]> {
  return request<DebtData[]>('/debts');
}

export async function createDebt(data: {
  person: string;
  type: 'lent' | 'borrowed';
  originalAmount: number;
  notes?: string;
}): Promise<DebtData> {
  return request<DebtData>('/debts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function recordPayment(id: number, amount: number): Promise<DebtData> {
  return request<DebtData>(`/debts/${id}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function deleteDebt(id: number): Promise<void> {
  await request<void>(`/debts/${id}`, { method: 'DELETE' });
}
