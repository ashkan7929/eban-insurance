import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'بانک بیمه ابان | بیمه آنلاین، ساده و سریع',
  description:
    'بانک بیمه ابان - بیمه شخص ثالث، حوادث، عمر و مسافرت را به صورت آنلاین، ساده و سریع خریداری کنید.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        {children}
        <Providers />
      </body>
    </html>
  );
}
