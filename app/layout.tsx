import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppToaster } from '@/components/app-toaster';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dubiken - Global Sourcing Platform',
  description: 'Direct Sourcing Ecosystem connecting Kenya, Dubai & China',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} font-sans`}>
        <QueryProvider>
          {children}
          <AppToaster />
        </QueryProvider>
      </body>
    </html>
  );
}
