import { request } from './client';

export async function fetchSettings(): Promise<{ savingsRate: number }> {
  return request<{ savingsRate: number }>('/settings');
}

export async function updateSettings(data: {
  savingsRate: number;
}): Promise<{ savingsRate: number }> {
  return request<{ savingsRate: number }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
