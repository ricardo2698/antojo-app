'use client';

import { useAuth } from '@/features/auth';
import { AdicionalesManager } from '@/features/adicionales/components/AdicionalesManager';

export default function AdicionalesPage() {
  const { user } = useAuth();

  if (!user?.restaurantId) return null;

  return <AdicionalesManager restaurantId={user.restaurantId} />;
}
