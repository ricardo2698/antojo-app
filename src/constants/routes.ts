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
    menu: '/dashboard/menu',
    estados: '/dashboard/estados',
    contabilidad: '/dashboard/contabilidad',
    configuracion: '/dashboard/configuracion',
    equipo: '/dashboard/equipo',
    domicilios: '/dashboard/domicilios',
  },
  // Public menu
  menu: (slug: string) => `/${slug}`,
} as const;
