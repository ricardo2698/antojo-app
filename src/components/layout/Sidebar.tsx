'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Utensils,
  ListOrdered,
} from 'lucide-react';

const SUPER_ADMIN_LINKS = [
  { href: ROUTES.admin.restaurants, label: 'Restaurantes', icon: Utensils },
];

const RESTAURANT_LINKS = [
  { href: ROUTES.dashboard.pedidos, label: 'Pedidos', icon: ShoppingBag },
  { href: ROUTES.dashboard.productos, label: 'Productos', icon: Package },
  { href: ROUTES.dashboard.categorias, label: 'Categorías', icon: Tag },
  { href: ROUTES.dashboard.estados, label: 'Estados', icon: ListOrdered },
  { href: ROUTES.dashboard.contabilidad, label: 'Contabilidad', icon: BarChart3 },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const links = user?.role === 'super_admin' ? SUPER_ADMIN_LINKS : RESTAURANT_LINKS;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-orange-500">Antojo App</h1>
        <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
