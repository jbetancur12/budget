import { request } from './client';
import type { CategoryData } from '../types';

export async function fetchCategories(): Promise<CategoryData[]> {
  return request<CategoryData[]>('/categories');
}

export async function createCategory(data: {
  name: string;
  type: 'income' | 'expense';
  budget?: number | null;
}): Promise<CategoryData> {
  return request<CategoryData>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; budget?: number | null },
): Promise<CategoryData> {
  return request<CategoryData>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await request<void>(`/categories/${id}`, { method: 'DELETE' });
}
