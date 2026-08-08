import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Care - การดูแลสัตว์เลี้ยง | Pawplan',
  description: 'เคล็ดลับและคู่มือการดูแลสุขภาพสัตว์เลี้ยงแสนรักของคุณอย่างถูกวิธี',
  openGraph: {
    title: 'Pet Care - การดูแลสัตว์เลี้ยง | Pawplan',
    description: 'เคล็ดลับและคู่มือการดูแลสุขภาพสัตว์เลี้ยงแสนรักของคุณอย่างถูกวิธี',
    images: [
      {
        url: '/assets/3.png',
        width: 1200,
        height: 630,
        alt: 'Pet Care Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/3.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
