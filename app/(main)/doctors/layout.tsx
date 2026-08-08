import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ทีมสัตวแพทย์ผู้เชี่ยวชาญ | Pawplan',
  description: 'ทำความรู้จักกับสัตวแพทย์และผู้เชี่ยวชาญเฉพาะทางที่พร้อมดูแลสัตว์เลี้ยงของคุณ',
  openGraph: {
    title: 'ทีมสัตวแพทย์ผู้เชี่ยวชาญ | Pawplan',
    description: 'ทำความรู้จักกับสัตวแพทย์และผู้เชี่ยวชาญเฉพาะทางที่พร้อมดูแลสัตว์เลี้ยงของคุณ',
    images: [
      {
        url: '/assets/4.png',
        width: 1200,
        height: 630,
        alt: 'Doctors Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/4.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
