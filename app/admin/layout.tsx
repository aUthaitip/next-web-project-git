import type { Metadata } from 'next';
import '../(main)/globals.css';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { LanguageProvider } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata: Metadata = {
  title: {
    default: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    template: '%s | Pawplan คลินิก',
  },
  description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย',
  openGraph: {
    title: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย',
    images: [
      {
        url: '/assets/1.png',
        width: 1200,
        height: 630,
        alt: 'Pawplan Clinic Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/1.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Favicon Paw Icon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐾</text></svg>" />
      </head>
      <body>
        <LanguageProvider>
          <AdminGuard>
            {children}
          </AdminGuard>
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}