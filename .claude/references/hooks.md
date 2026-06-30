# Custom Hooks — Convenciones

## Reglas absolutas

- Todo hook vive en un archivo propio: `useOrders.ts`, no en el componente.
- Nombre siempre empieza con `use`.
- Máximo ~80 líneas. Si crece → extrae helpers o divide en hooks más pequeños.
- Un hook = una responsabilidad (fetch, mutación, formulario, UI state).
- **Nunca mezcles** fetch de datos con lógica de formulario en el mismo hook.

---

## Hook de consulta de datos (React Query)

```ts
// features/orders/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orders.service';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { OrderFilters } from '../types/order.types';

interface UseOrdersParams {
  filters?: OrderFilters;
  enabled?: boolean;
}

export function useOrders({ filters, enabled = true }: UseOrdersParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(filters),
    queryFn: () => getOrders(filters),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
```

---

## Hook de mutación (React Query)

```ts
// features/orders/hooks/useUpdateOrderStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../services/orders.service';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { Order } from '../types/order.types';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      updateOrderStatus(orderId, status),

    onSuccess: () => {
      // Invalida el cache → refetch automático
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
}
```

---

## Hook de UI / estado local del componente

Cuando un componente tiene lógica de estado compleja, extráela:

```ts
// features/orders/hooks/useOrderCard.ts
import { useUpdateOrderStatus } from './useUpdateOrderStatus';
import type { Order } from '../types/order.types';

interface UseOrderCardParams {
  order: Order;
  onStatusChange?: (orderId: string, status: Order['status']) => void;
}

export function useOrderCard({ order, onStatusChange }: UseOrderCardParams) {
  const { mutate, isPending } = useUpdateOrderStatus();

  function handleStatusChange() {
    const nextStatus = getNextStatus(order.status);
    mutate(
      { orderId: order.id, status: nextStatus },
      { onSuccess: () => onStatusChange?.(order.id, nextStatus) }
    );
  }

  return {
    handleStatusChange,
    isUpdating: isPending,
  };
}

// Helper puro (puede ir en un archivo helpers.ts si crece)
function getNextStatus(current: Order['status']): Order['status'] {
  const flow: Record<Order['status'], Order['status']> = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
    delivered: 'delivered',
  };
  return flow[current];
}
```

---

## Hook de formulario

```ts
// features/menu/hooks/useMenuItemForm.ts
import { useState } from 'react';
import { z } from 'zod';
import type { MenuItemFormData } from '../types/menu.types';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  price: z.number().positive('Debe ser mayor a 0'),
  category: z.string().min(1, 'Selecciona una categoría'),
});

export function useMenuItemForm(initialData?: Partial<MenuItemFormData>) {
  const [data, setData] = useState<MenuItemFormData>({
    name: initialData?.name ?? '',
    price: initialData?.price ?? 0,
    category: initialData?.category ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItemFormData, string>>>({});

  function handleChange<K extends keyof MenuItemFormData>(field: K, value: MenuItemFormData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const result = menuItemSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof MenuItemFormData;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  }

  return { data, errors, handleChange, validate };
}
```

---

## Hooks globales reutilizables

```ts
// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Antipatrones en hooks

```ts
// ❌ Mezclar responsabilidades
export function useOrdersPage() {
  const [filter, setFilter] = useState('all');
  const orders = useQuery(...);          // fetch
  const { mutate } = useMutation(...);   // mutación
  const [modalOpen, setModalOpen] = useState(false); // UI
  // → separa en useOrders, useUpdateOrder, useOrderModal

// ❌ Lógica de API dentro del hook
export function useOrders() {
  return useQuery({
    queryFn: async () => {
      const res = await fetch('/api/orders'); // ← mueve a services/
      return res.json();
    }
  });
}
```
