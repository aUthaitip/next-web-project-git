import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'นัดหมายบริการ | Pawplan',
  description: 'นัดหมายบริการดูแลรักษาสัตว์เลี้ยงของคุณออนไลน์กับแพทย์เฉพาะทาง',
  openGraph: {
    title: 'นัดหมายบริการ | Pawplan',
    description: 'นัดหมายบริการดูแลรักษาสัตว์เลี้ยงของคุณออนไลน์กับแพทย์เฉพาะทาง',
    images: [
      {
        url: '/assets/2.png',
        width: 1200,
        height: 630,
        alt: 'Appointment Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/2.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
