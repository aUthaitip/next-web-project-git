import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { LanguageProvider } from '@/context/LanguageContext';

// Metadata สำหรับเว็บไซต์ทั้งหมด
export const metadata: Metadata = {
  title: {
    default: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    template: '%s | Pawplan คลินิก',
  },
  description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย พร้อมแพทย์ผู้เชี่ยวชาญดูแลอย่างใกล้ชิด',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Font และ Icons ภายนอก */}
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Favicon Paw Icon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐾</text></svg>" />
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}