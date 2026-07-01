'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { useRestaurant } from '@/features/restaurants/hooks/useRestaurants';
import { ROUTES } from '@/constants/routes';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";
const sm = "var(--font-space-mono, monospace)";

function BiteLogo() {
  return (
    <svg viewBox="0 0 1024 1024" width="30" height="30">
      <defs>
        <linearGradient id="sb-g" x1="102" y1="102" x2="922" y2="922" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB02E" />
          <stop offset="0.55" stopColor="#FF6A1A" />
          <stop offset="1" stopColor="#EA3B2E" />
        </linearGradient>
        <mask id="sb-m">
          <rect width="1024" height="1024" fill="#fff" />
          <circle cx="819.2" cy="215" r="307.2" fill="#000" />
        </mask>
      </defs>
      <circle cx="512" cy="512" r="512" fill="url(#sb-g)" mask="url(#sb-m)" />
    </svg>
  );
}

const SUPER_ADMIN_LINKS = [
  {
    href: ROUTES.admin.restaurants,
    label: 'Restaurantes',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
];

const RESTAURANT_LINKS = [
  {
    href: ROUTES.dashboard.root,
    label: 'Inicio',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.pedidos,
    label: 'Pedidos',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.productos,
    label: 'Productos',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.categorias,
    label: 'Categorías',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9zM7 7h.01" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.estados,
    label: 'Estados',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.contabilidad,
    label: 'Contabilidad',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.adicionales,
    label: 'Adicionales',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: ROUTES.dashboard.configuracion,
    label: 'Configuración',
    icon: (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const isSuperAdmin = user?.role === 'super_admin';
  const links = isSuperAdmin ? SUPER_ADMIN_LINKS : RESTAURANT_LINKS;

  const { data: restaurant } = useRestaurant(!isSuperAdmin ? user?.restaurantId : undefined);

  const initial = (user?.displayName ?? user?.email ?? '?')[0].toUpperCase();
  const restaurantInitial = (restaurant?.name ?? '?')[0].toUpperCase();

  return (
    <aside
      className="flex w-[260px] flex-shrink-0 flex-col"
      style={{
        background: 'radial-gradient(120% 60% at 20% 0%, #3a2417, #1B1512 55%)',
        minHeight: '100vh',
        padding: '26px 18px',
        fontFamily: sg,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 8px', marginBottom: 6 }}>
        <BiteLogo />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-.02em', color: '#FBF6F1', lineHeight: 1 }}>
            Antojo<span style={{ color: '#FF6A1A' }}>.</span>
          </div>
          {isSuperAdmin && (
            <div style={{ fontFamily: sm, fontSize: 9, letterSpacing: '.12em', color: '#FF8A3D', marginTop: 3 }}>
              SUPER ADMIN
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '22px 8px' }} />

      {/* Restaurant selector (restaurant_admin only) */}
      {!isSuperAdmin && restaurant && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px',
            borderRadius: 13, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
              background: restaurant.logo ? '#fff' : 'linear-gradient(135deg, #FFB02E, #EA3B2E)',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 16, color: '#fff', position: 'relative',
            }}
          >
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt={restaurant.name} fill style={{ objectFit: 'contain', padding: 4 }} />
            ) : (
              restaurantInitial
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#fbf6f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {restaurant.name}
            </div>
            <div style={{ fontFamily: sm, fontSize: 10, color: restaurant.isActive ? '#7BD88F' : '#b8aaa0' }}>
              {restaurant.isActive ? '● Abierto' : '● Cerrado'}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderRadius: 11, fontWeight: 500, fontSize: 14, textDecoration: 'none',
                transition: 'background .15s, color .15s',
                background: active ? 'linear-gradient(135deg, rgba(255,138,43,.22), rgba(234,59,46,.14))' : 'transparent',
                color: active ? '#fff' : '#b8aaa0',
              }}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '12px 10px',
            borderRadius: 12, background: 'rgba(255,255,255,.05)',
          }}
        >
          <div
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #FFB02E, #EA3B2E)',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff',
            }}
          >
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#fbf6f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.displayName ?? 'Admin'}
            </div>
            <div style={{ fontFamily: sm, fontSize: 10, color: '#b8aaa0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
            borderRadius: 11, fontWeight: 500, fontSize: 14, color: '#b8aaa0',
            background: 'none', border: 'none', cursor: 'pointer', width: '100%',
            marginTop: 6, fontFamily: sg, transition: 'color .15s',
          }}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
