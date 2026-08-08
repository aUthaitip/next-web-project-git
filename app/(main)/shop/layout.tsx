import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pawplan Shop - ร้านค้าสุนัขและแมว | Pawplan',
  description: 'เลือกซื้อสินค้า อาหารเสริม และอุปกรณ์คุณภาพดีเพื่อสัตว์เลี้ยงของคุณ',
  openGraph: {
    title: 'Pawplan Shop - ร้านค้าสุนัขและแมว | Pawplan',
    description: 'เลือกซื้อสินค้า อาหารเสริม และอุปกรณ์คุณภาพดีเพื่อสัตว์เลี้ยงของคุณ',
    images: [
      {
        url: '/assets/5.png',
        width: 1200,
        height: 630,
        alt: 'Shop Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/5.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
