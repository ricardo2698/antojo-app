# TypeScript — Convenciones

## tsconfig.json (strict mode)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Organización de tipos

### Tipos de dominio → `feature/types/feature.types.ts`

```ts
// features/orders/types/order.types.ts

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;    // ISO 8601
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
```

### Tipos de API → `types/api.types.ts`

```ts
// types/api.types.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;  // Para errores de validación
}
```

### Tipos de formulario → junto al hook o en el archivo de tipos del feature

```ts
// features/menu/types/menu.types.ts

export interface MenuItemFormData {
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
}
```

---

## Reglas de tipado

### ✅ Correcto

```ts
// Usa type para uniones, alias y primitivos compuestos
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';
type OrderId = string;

// Usa interface para objetos y props de componentes
interface OrderCardProps {
  order: Order;
  compact?: boolean;
  onStatusChange?: (id: string, status: OrderStatus) => void;
}

// Genéricos explícitos
function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> { ... }

// Narrowing en lugar de casting
function getStatusLabel(status: string): string {
  if (isOrderStatus(status)) return ORDER_STATUS_LABEL[status];
  return 'Desconocido';
}

function isOrderStatus(value: string): value is OrderStatus {
  return ['pending', 'preparing', 'ready', 'delivered'].includes(value);
}
```

### ❌ Prohibido

```ts
// ❌ any
const data: any = await fetch(...);

// ❌ as para silenciar errores
const order = response as Order;  // sin validación previa

// ❌ Non-null assertion sin garantía
const order = orders.find(o => o.id === id)!;  // puede ser undefined

// ❌ Tipos en el mismo archivo que el componente (salvo tipos inline triviales)
// OrderCard.tsx
interface Props { ... }  // → mover a OrderCard.types.ts
export function OrderCard({ ... }: Props) { ... }
```

---

## Query Keys tipados

```ts
// constants/query-keys.ts
export const QUERY_KEYS = {
  orders: {
    all: ['orders'] as const,
    list: (filters?: OrderFilters) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  menu: {
    all: ['menu'] as const,
    list: (category?: string) => ['menu', 'list', category] as const,
    item: (id: string) => ['menu', 'item', id] as const,
  },
} as const;
```

---

## Zod para validación de datos externos

```ts
// features/orders/services/orders.service.ts
import { z } from 'zod';

const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  total: z.number(),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })),
});

// Siempre valida datos que vienen de APIs externas o del cliente
export type Order = z.infer<typeof orderSchema>;  // El tipo sale del schema
```
