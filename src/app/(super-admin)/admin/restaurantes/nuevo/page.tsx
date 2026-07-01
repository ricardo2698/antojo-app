'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { RestaurantForm } from '@/features/restaurants/components/RestaurantForm';
import { MenuPreview } from '@/features/restaurants/components/RestaurantForm/MenuPreview';
import type { RestaurantColorsPayload } from '@/features/restaurants/components/RestaurantForm/RestaurantForm.types';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";

const DEFAULT_COLORS: RestaurantColorsPayload = {
  pri: '#F59211', sec: '#1F5130', acc: '#FFE7C4', bg: '#FBF3E9', name: '',
};

export default function NuevoRestaurantePage() {
  const router = useRouter();
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 11, border: '1.5px solid #E7DED6',
            background: '#fff', color: '#8a7f76', cursor: 'pointer', flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#FBF8F5'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 22, letterSpacing: '-.02em', color: '#1B1512', margin: 0 }}>
            Nuevo restaurante
          </h1>
          <p style={{ fontSize: 13, color: '#9a8f86', margin: '3px 0 0' }}>
            Completá los datos para crear el restaurante y su usuario administrador.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Form */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', borderRadius: 18, border: '1px solid #EFE7DF', background: '#fff' }}>
          <RestaurantForm onSuccess={goBack} onCancel={goBack} onColorsChange={setColors} />
        </div>

        {/* Live preview */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: sg, fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: '#9a8f86', textTransform: 'uppercase', marginTop: 200 }}>
            Vista previa del menú
          </div>
          <div style={{
            width: 300, height: 620,
            borderRadius: 40, border: '8px solid #1B1512',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,.35)',
            background: '#fff',
          }}>
            <MenuPreview pri={colors.pri} sec={colors.sec} acc={colors.acc} bg={colors.bg} name={colors.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
