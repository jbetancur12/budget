import { request } from './client';
import type { ItemData } from '../types';

export async function fetchItems(
  monthOffset = 0,
  search?: string,
  categoryId?: number,
): Promise<ItemData[]> {
  let url = `/items?monthOffset=${monthOffset}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (categoryId !== undefined) url += `&categoryId=${categoryId}`;
  return request<ItemData[]>(url);
}

export async function createItem(data: {
  name: string;
  amount: number;
  type: 'Fijo' | 'Variable';
  categoryId: number;
  monthOffset: number;
  date?: string;
  recurring?: boolean;
}): Promise<ItemData> {
  return request<ItemData>('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItem(
  id: number,
  data: {
    amount?: number;
    name?: string;
    type?: string;
    recurring?: boolean;
    date?: string;
    categoryId?: number;
  },
): Promise<ItemData> {
  return request<ItemData>(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteItem(id: number): Promise<void> {
  await request<void>(`/items/${id}`, { method: 'DELETE' });
}
