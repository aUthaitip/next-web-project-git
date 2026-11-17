import { cookies } from 'next/headers';
import type { User } from '@/features/auth/types';

// Temporary adapter for optional Next.js integrations while the member UI uses
// Fiber. Identity is always verified by Go; never trust a client-supplied ID.
export async function getMemberUser(): Promise<User | null> {
  const token = (await cookies()).get('pawplan-go-session')?.value;
  if (!token) return null;
  const base = (process.env.GO_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
  const response = await fetch(`${base}/auth/me`, {
    headers: { Cookie: `pawplan-go-session=${encodeURIComponent(token)}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Member API is unavailable');
  return response.json() as Promise<User>;
}
