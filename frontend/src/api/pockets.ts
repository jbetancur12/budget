import { request } from './client';
import type { PocketData } from '../types';

export async function fetchPockets(): Promise<PocketData[]> {
  return request<PocketData[]>('/pockets');
}

export async function createPocket(data: { name: string; goal: number; color: string; icon: string }): Promise<PocketData> {
  return request<PocketData>('/pockets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePocket(id: number, data: Partial<PocketData>): Promise<PocketData> {
  return request<PocketData>(`/pockets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePocket(id: number): Promise<void> {
  await request<void>(`/pockets/${id}`, { method: 'DELETE' });
}

export async function transferToPocket(id: number, amount: number): Promise<PocketData> {
  return request<PocketData>(`/pockets/${id}/transfer`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
