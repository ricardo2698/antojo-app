# Convenciones Generales — Naming, Imports, Lint

## Naming conventions

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `OrderCard`, `MenuGrid` |
| Hooks | camelCase con `use` prefix | `useOrders`, `useOrderCard` |
| Archivos de componente | PascalCase | `OrderCard.tsx` |
| Archivos de hook | camelCase | `useOrders.ts` |
| Archivos de tipos | camelCase + `.types.ts` | `order.types.ts` |
| Archivos de service | camelCase + `.service.ts` | `orders.service.ts` |
| Archivos de schema | camelCase + `.schemas.ts` | `orders.schemas.ts` |
| Constantes | UPPER_SNAKE_CASE | `QUERY_KEYS`, `ORDER_STATUS_LABEL` |
| Variables/funciones | camelCase | `handleStatusChange`, `isUpdating` |
| CSS classes | Tailwind utilities | — |
| Rutas de carpeta | kebab-case | `order-detail/`, `menu-items/` |

---

## Imports — Orden y alias

### tsconfig paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Orden de imports (eslint-plugin-import)

```ts
// 1. React y Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NextRequest } from 'next/server';

// 2. Librerías externas
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Imports internos absolutos (@/)
import { QUERY_KEYS } from '@/constants/query-keys';
import { Badge } from '@/components/ui/Badge';

// 4. Imports del mismo feature (relativos)
import { useOrders } from '../hooks/useOrders';
import type { OrderCardProps } from './OrderCard.types';
```

**Regla:** siempre usa `@/` para imports entre features. Nunca `../../features/orders` desde otro feature.

---

## ESLint — Configuración recomendada

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/no-floating-promises": "error",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling"],
      "newlines-between": "always"
    }],
    "import/no-default-export": "warn",  // Preferir named exports (excepción: pages y layouts)
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

---

## Prettier — Configuración

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Exports — Named vs Default

```ts
// ✅ Named exports para todo (más fácil de refactorizar con IDE)
export function OrderCard(...) { ... }
export function useOrders(...) { ... }
export type { Order };

// ✅ Default export SOLO para pages y layouts (Next.js lo requiere)
export default function OrdersPage() { ... }
export default function DashboardLayout(...) { ... }

// ❌ Default export en componentes/hooks reutilizables
export default function OrderCard(...) { ... }
```

---

## Constantes del dominio

```ts
// constants/config.ts
import type { OrderStatus } from '@/features/orders/types/order.types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'En preparación',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'yellow',
  preparing: 'blue',
  ready: 'green',
  delivered: 'gray',
  cancelled: 'red',
};
```

---

## Utilidades compartidas

```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge de clases Tailwind (evita conflictos)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formato de moneda (Colombia)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Formato de fecha legible
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString));
}
```

---

## Checklist antes de hacer commit

- [ ] No hay `any` en el código
- [ ] Todos los `useEffect` tienen sus dependencias correctas
- [ ] Las interfaces/tipos están en archivos `.types.ts`
- [ ] Los hooks están en archivos `use*.ts` separados
- [ ] Ningún componente supera 300 líneas
- [ ] No hay `console.log` (solo `console.error` para errores reales)
- [ ] Los imports están ordenados
- [ ] `eslint` y `tsc --noEmit` pasan sin errores
