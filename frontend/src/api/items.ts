import { request } from './client';
import type { ItemData } from '../types';

export async function fetchItems(category: string, monthOffset = 0): Promise<ItemData[]> {
  return request<ItemData[]>(`/items?category=${category}&monthOffset=${monthOffset}`);
}

export async function createItem(data: {
  name: string;
  amount: number;
  type: 'Fijo' | 'Variable';
  category: string;
  monthOffset: number;
  date?: string;
}): Promise<ItemData> {
  return request<ItemData>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(id: number, data: { amount?: number; name?: string; type?: string }): Promise<ItemData> {
  return request<ItemData>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(id: number): Promise<void> {
  await request<void>(`/items/${id}`, { method: 'DELETE' });
}
