// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        {/* Font และ Icons ภายนอก */}
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}