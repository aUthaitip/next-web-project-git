import { apiRequest } from '@/lib/api-client';
import type { User } from '@/features/auth/types';

export interface ProfileInput {
  name: string; email: string; phone: string; image: string;
  currentPassword: string; newPassword: string;
}
export const updateProfile = (input: ProfileInput) => apiRequest<User>('/profile', { method: 'PUT', body: JSON.stringify(input) });

// The avatar is stored with the profile; reading it locally avoids an extra
// unauthenticated upload endpoint and preserves the existing data-URL format.
export function readAvatar(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 1.5 * 1024 * 1024) {
    return Promise.reject(new Error('เลือกภาพ PNG, JPEG, WebP หรือ GIF ขนาดไม่เกิน 1.5 MB'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ภาพได้ / Unable to read image'));
    reader.readAsDataURL(file);
  });
}
