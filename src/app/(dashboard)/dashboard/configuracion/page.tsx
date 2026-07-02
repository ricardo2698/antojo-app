'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Copy, Check } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useRestaurant } from '@/features/restaurants/hooks/useRestaurants';
import { RestaurantForm } from '@/features/restaurants/components/RestaurantForm';
import { MenuPreview } from '@/features/restaurants/components/RestaurantForm/MenuPreview';
import type { RestaurantColorsPayload } from '@/features/restaurants/components/RestaurantForm/RestaurantForm.types';
import { ROUTES } from '@/constants/routes';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";
const sm = 'var(--font-space-mono, monospace)';

const DEFAULT_COLORS: RestaurantColorsPayload = {
  pri: '#F59211',
  sec: '#1F5130',
  acc: '#FFE7C4',
  bg: '#FBF3E9',
  name: '',
  layout: 'cards',
};

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: restaurant, isLoading } = useRestaurant(user?.restaurantId);
  const [colors, setColors] = useState<RestaurantColorsPayload>(DEFAULT_COLORS);
  const [copied, setCopied] = useState(false);

  function getMenuUrl(slug: string) {
    return `${window.location.origin}/${slug}`;
  }

  function handleCopy(slug: string) {
    navigator.clipboard.writeText(getMenuUrl(slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user?.restaurantId) return null;

  return (
    <div style={{ fontFamily: sg }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: sm,
            fontSize: 10,
            letterSpacing: '.1em',
            color: '#9a8f86',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Configuración
        </div>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '-.02em',
            color: '#1B1512',
            margin: 0,
          }}
        >
          Tu restaurante
        </h1>
        <p style={{ fontSize: 13, color: '#9a8f86', margin: '3px 0 0' }}>
          Editá el nombre, descripción, teléfono, logo y tema visual de tu menú.
        </p>
      </div>

      {isLoading ? (
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '4px solid #FF6A1A',
              borderTopColor: 'transparent',
              display: 'block',
              animation: 'spin 0.7s linear infinite',
            }}
          />
        </div>
      ) : !restaurant ? (
        <div
          style={{
            borderRadius: 18,
            border: '1px solid #EFE7DF',
            background: '#fff',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14, color: '#9a8f86' }}>Restaurante no encontrado.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Form column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Link del menú */}
            <div
              style={{
                borderRadius: 18,
                border: '1px solid #EFE7DF',
                background: '#fff',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontFamily: sm,
                  fontSize: 10,
                  letterSpacing: '.08em',
                  color: '#9a8f86',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                Link de tu menú público
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#FBF8F5',
                    border: '1.5px solid #E7DED6',
                    borderRadius: 12,
                    padding: '10px 14px',
                    minWidth: 0,
                  }}
                >
                  <ExternalLink size={15} color="#9a8f86" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: sm,
                      fontSize: 12,
                      color: '#5a5048',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {typeof window !== 'undefined'
                      ? getMenuUrl(restaurant.slug)
                      : `/${restaurant.slug}`}
                  </span>
                </div>
                <a
                  href={`/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: '#FBF8F5',
                    border: '1.5px solid #E7DED6',
                    fontFamily: sg,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#5a5048',
                    textDecoration: 'none',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'background .12s',
                  }}
                >
                  <ExternalLink size={14} />
                  Abrir
                </a>
                <button
                  onClick={() => handleCopy(restaurant.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: copied ? '#f0faf4' : '#FBF8F5',
                    border: `1.5px solid ${copied ? '#2C7A52' : '#E7DED6'}`,
                    fontFamily: sg,
                    fontSize: 13,
                    fontWeight: 600,
                    color: copied ? '#2C7A52' : '#5a5048',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all .15s',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div
              style={{
                overflow: 'hidden',
                borderRadius: 18,
                border: '1px solid #EFE7DF',
                background: '#fff',
              }}
            >
              <RestaurantForm
                restaurant={restaurant}
                onSuccess={() => router.push(ROUTES.dashboard.root)}
                onCancel={() => router.push(ROUTES.dashboard.root)}
                onColorsChange={setColors}
              />
            </div>
          </div>

          {/* Live preview */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: sg,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.08em',
                color: '#9a8f86',
                textTransform: 'uppercase',
                marginTop: 200,
              }}
            >
              Vista previa del menú
            </div>
            <div
              style={{
                width: 300,
                height: 620,
                borderRadius: 40,
                border: '8px solid #1B1512',
                overflow: 'hidden',
                boxShadow: '0 30px 60px -20px rgba(0,0,0,.35)',
                background: '#fff',
              }}
            >
              <MenuPreview
                pri={colors.pri}
                sec={colors.sec}
                acc={colors.acc}
                bg={colors.bg}
                name={colors.name}
                layout={colors.layout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
