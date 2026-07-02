import { request } from './client';
import type { ChartData } from '../types';

export async function fetchChartHistory(): Promise<ChartData[]> {
  return request<ChartData[]>('/chart');
}
