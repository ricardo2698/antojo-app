import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { Order } from '@/types';

import type { DateRange } from '../types/accounting.types';

export function useAccountingOrders(restaurantId: string, range: DateRange) {
  return useQuery({
    queryKey: ['accounting', restaurantId, range.start, range.end],
    queryFn: async () => {
      const q = query(
        collection(db, 'restaurants', restaurantId, 'orders'),
        where('createdAt', '>=', range.start),
        where('createdAt', '<=', range.end),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Order);
    },
    enabled: !!restaurantId && !!range.start && !!range.end,
    staleTime: 1000 * 60 * 2,
  });
}
