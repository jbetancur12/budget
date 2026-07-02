import { request } from './client';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string; name: string };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return request<void>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function logout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST' });
}
