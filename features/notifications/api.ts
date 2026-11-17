import { apiRequest } from '@/lib/api-client';
import type { Notification } from './types';

export const getNotifications = () => apiRequest<{ notifications: Notification[] }>('/notifications');
export const markNotificationRead = (id: number) => apiRequest<void>('/notifications', { method: 'PATCH', body: JSON.stringify({ id }) });
export const markAllNotificationsRead = () => apiRequest<void>('/notifications', { method: 'PATCH', body: JSON.stringify({ all: true }) });
