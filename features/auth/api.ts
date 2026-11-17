import { apiRequest, ApiError } from '@/lib/api-client';
import type { LoginInput, RegisterInput, User } from './types';

export const login = (input: LoginInput) => apiRequest<User>('/auth/login', { method: 'POST', body: JSON.stringify(input) });
export const register = (input: RegisterInput) => apiRequest<User>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
export const logout = () => apiRequest<void>('/auth/logout', { method: 'POST' });
export async function getCurrentUser(): Promise<User | null> {
  try { return await apiRequest<User>('/auth/me'); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
