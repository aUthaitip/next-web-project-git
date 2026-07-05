import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SessionUser {
  id: number;
  name: string;
  email: string;
}

export function useNotifications(user: SessionUser | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setNotifications((prev) => (prev.length > 0 ? [] : prev));
      }, 0);
      return;
    }

    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setNotifications(data.notifications ?? []);
        }
      } catch {}
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const markRead = useCallback(async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markRead,
    markAllRead,
  };
}