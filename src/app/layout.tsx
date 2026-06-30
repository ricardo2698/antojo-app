import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/features/auth';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Antojo App',
  description: 'Plataforma de menús y pedidos para restaurantes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
