import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppToaster } from '@/components/app-toaster';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dubiken | Electronics, perfumes & spare parts',
  description:
    'Certified electronics, perfumes, and spare parts imported through Dubai and China. One marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <QueryProvider>
          {children}
          <AppToaster />
        </QueryProvider>
      </body>
    </html>
  );
}
