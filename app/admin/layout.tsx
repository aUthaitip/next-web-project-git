// app/admin/layout.tsx
import type { Metadata } from 'next';
import '../(main)/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Pawplan | คลินิกสัตว์เลี้ยง – วางแผนสุขภาพเพื่อเพื่อนรัก',
    template: '%s | Pawplan คลินิก',
  },
  description: 'คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}