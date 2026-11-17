import SiteLayout from '@/shared/layouts/SiteLayout';
import './globals.css';
import type { Metadata } from 'next';

// Metadata สำหรับเว็บไซต์ทั้งหมด
export const metadata: Metadata = {
  title: {
    default: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    template: '%s | Pawplan คลินิก',
  },
  description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย พร้อมแพทย์ผู้เชี่ยวชาญดูแลอย่างใกล้ชิด',
  openGraph: {
    title: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย พร้อมแพทย์ผู้เชี่ยวชาญดูแลอย่างใกล้ชิด',
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
  return <SiteLayout>{children}</SiteLayout>;
}
