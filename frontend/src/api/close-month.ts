import { request } from './client';

export interface CloseMonthPayload {
  closeOption: string;
  pocketAmounts?: Record<number, number>;
  currentMonthOffset?: number;
}

export interface CloseMonthResult {
  ok: boolean;
  nextOffset: number;
}

export async function closeMonth(data: CloseMonthPayload): Promise<CloseMonthResult> {
  return request<CloseMonthResult>('/close-month', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
