'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AppLoader } from '@/components/ui/AppLoader';
import { ROUTES } from '@/constants/routes';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(ROUTES.login);
    }
  }, [user, loading, router]);

  if (loading) return <AppLoader theme="dark" message="Cargando" />;
  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: '#FBF8F5', fontFamily: "var(--font-space-grotesk, 'Inter', sans-serif)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
