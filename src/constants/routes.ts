export const ROUTES = {
  home: '/',
  login: '/login',
  // Super admin
  admin: {
    root: '/admin',
    restaurants: '/admin/restaurantes',
  },
  // Restaurant dashboard
  dashboard: {
    root: '/dashboard',
    pedidos: '/dashboard/pedidos',
    productos: '/dashboard/productos',
    categorias: '/dashboard/categorias',
    estados: '/dashboard/estados',
    contabilidad: '/dashboard/contabilidad',
    adicionales: '/dashboard/adicionales',
    configuracion: '/dashboard/configuracion',
  },
  // Public menu
  menu: (slug: string) => `/${slug}`,
} as const;
