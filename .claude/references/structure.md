# Estructura de Carpetas — Next.js Senior

## Estructura base del proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: autenticación
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route group: panel principal
│   │   ├── orders/
│   │   │   ├── page.tsx          # Página de pedidos
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Detalle de pedido
│   │   │   └── loading.tsx
│   │   ├── menu/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── menu/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home
│   └── globals.css
│
├── features/                     # Módulos de negocio (feature-based)
│   ├── orders/
│   │   ├── components/           # Componentes exclusivos de orders
│   │   │   ├── OrderCard/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderCard.types.ts
│   │   │   │   └── index.ts
│   │   │   └── OrderList/
│   │   │       ├── OrderList.tsx
│   │   │       ├── OrderList.types.ts
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   ├── useOrders.ts
│   │   │   └── useOrderMutation.ts
│   │   ├── services/
│   │   │   └── orders.service.ts
│   │   ├── types/
│   │   │   └── order.types.ts
│   │   └── index.ts              # Barrel export del feature
│   │
│   └── menu/
│       ├── components/
│       │   ├── MenuItemCard/
│       │   └── MenuGrid/
│       ├── hooks/
│       │   └── useMenu.ts
│       ├── services/
│       │   └── menu.service.ts
│       ├── types/
│       │   └── menu.types.ts
│       └── index.ts
│
├── components/                   # Componentes compartidos (UI genérico)
│   ├── ui/                       # Componentes base (Button, Input, Badge...)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   └── Badge/
│   ├── layout/                   # Header, Sidebar, Footer...
│   │   ├── Sidebar/
│   │   └── Header/
│   └── shared/                   # Componentes de dominio compartido
│       └── StatusBadge/
│
├── hooks/                        # Hooks globales reutilizables
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── usePagination.ts
│
├── lib/                          # Utilidades y configuraciones
│   ├── query-client.ts           # React Query config
│   ├── axios.ts                  # Axios instance
│   └── utils.ts                  # Helpers genéricos (cn, formatCurrency...)
│
├── types/                        # Tipos globales compartidos
│   ├── api.types.ts              # Tipos de respuesta de API
│   ├── common.types.ts           # Tipos comunes (Pagination, Status...)
│   └── index.ts
│
└── constants/                    # Constantes globales
    ├── routes.ts
    ├── query-keys.ts             # React Query keys
    └── config.ts
```

## Reglas de estructura

### Feature-based vs Global

- **`features/`** → Lógica, componentes y tipos exclusivos de un dominio.
- **`components/`** → Solo cuando el componente es reutilizable en 2+ features.
- **`hooks/`** global → Solo hooks sin dependencia de dominio específico.

### Barrel exports (`index.ts`)

Cada carpeta de componente expone un `index.ts`:

```ts
// features/orders/components/OrderCard/index.ts
export { OrderCard } from './OrderCard';
export type { OrderCardProps } from './OrderCard.types';
```

El feature entero se exporta desde su `index.ts`:
```ts
// features/orders/index.ts
export * from './components/OrderCard';
export * from './components/OrderList';
export * from './hooks/useOrders';
export type * from './types/order.types';
```

### Carpetas de componente

Cada componente no trivial vive en su propia carpeta:
```
OrderCard/
├── OrderCard.tsx        → JSX únicamente
├── OrderCard.types.ts   → Props e interfaces
└── index.ts             → Barrel export
```

Si necesita estilos propios o subcomponentes:
```
OrderCard/
├── OrderCard.tsx
├── OrderCard.types.ts
├── OrderCard.helpers.ts  → Funciones puras de presentación
├── OrderStatusChip.tsx   → Subcomponente interno (no exportado)
└── index.ts
```

### Route Groups `(name)`

Agrupa rutas con layout compartido sin afectar la URL:
- `(auth)` → Rutas sin sidebar (login, register)
- `(dashboard)` → Rutas con sidebar + header
- `(public)` → Landing, menú público, etc.
