import DocumentLayout from '@/shared/layouts/DocumentLayout';
import AdminGuard from '../components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout><AdminGuard>{children}</AdminGuard></DocumentLayout>;
}
