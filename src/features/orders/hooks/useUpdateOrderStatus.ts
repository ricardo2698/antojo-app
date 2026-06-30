import { useState } from 'react';

import { ordersService } from '../services/orders.service';

export function useUpdateOrderStatus(restaurantId: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(orderId: string, statusId: string): Promise<void> {
    setIsPending(true);
    setError(null);
    try {
      await ordersService.updateStatus(restaurantId, orderId, statusId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
      throw err;
    } finally {
      setIsPending(false);
    }
  }

  return { updateStatus, isPending, error };
}
