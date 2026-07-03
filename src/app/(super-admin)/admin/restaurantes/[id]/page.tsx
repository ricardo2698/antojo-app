'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { useRestaurant } from '@/features/restaurants/hooks/useRestaurants';
import { RestaurantForm } from '@/features/restaurants/components/RestaurantForm';
import { MenuPreview } from '@/features/restaurants/components/RestaurantForm/MenuPreview';
import type { RestaurantColorsPayload } from '@/features/restaurants/components/RestaurantForm/RestaurantForm.types';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";

const DEFAULT_COLORS: RestaurantColorsPayload = {
  pri: '#F59211',
  sec: '#1F5130',
  acc: '#FFE7C4',
  bg: '#FBF3E9',
  name: '',
  layout: 'cards',
  logo: '',
  bannerImage: '',
};

export default function EditarRestaurantePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: restaurant, isLoading } = useRestaurant(id);
  const [colors, setColors] = useState<RestaurantColorsPayload>(DEFAULT_COLORS);

  function goBack() {
    router.push('/admin/restaurantes');
  }

  return (
    <div style={{ fontFamily: sg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button
          onClick={goBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 11,
            border: '1.5px solid #E7DED6',
            background: '#fff',
            color: '#8a7f76',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FBF8F5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#fff';
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '-.02em',
              color: '#1B1512',
              margin: 0,
            }}
          >
            {restaurant ? `Editar: ${restaurant.name}` : 'Editar restaurante'}
          </h1>
          <p style={{ fontSize: 13, color: '#9a8f86', margin: '3px 0 0' }}>
            Actualizá la información del restaurante.
          </p>
        </div>
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
          {/* Form */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              borderRadius: 18,
              border: '1px solid #EFE7DF',
              background: '#fff',
            }}
          >
            <RestaurantForm
              restaurant={restaurant}
              onSuccess={goBack}
              onCancel={goBack}
              onColorsChange={setColors}
            />
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
