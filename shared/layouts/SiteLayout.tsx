import DocumentLayout from './DocumentLayout';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocumentLayout>
      <Header />
      <main>{children}</main>
      <Footer />
    </DocumentLayout>
  );
}
