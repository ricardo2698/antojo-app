import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { Order } from '@/types';

export function useOrders(restaurantId: string, refreshKey = 0) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const q = query(
      collection(db, 'restaurants', restaurantId, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Order));
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [restaurantId, refreshKey]);

  return { orders, isLoading, error };
}
