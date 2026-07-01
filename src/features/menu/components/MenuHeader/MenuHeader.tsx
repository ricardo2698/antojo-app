import Image from 'next/image';

import type { Restaurant } from '@/types';

interface MenuHeaderProps {
  restaurant: Restaurant;
}

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";
const sm = "var(--font-space-mono, monospace)";

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const { name, tagline, description, logo, theme } = restaurant;
  const { primaryColor: pri, secondaryColor: sec, accentColor: acc } = theme;
  const subtitle = tagline || description;

  return (
    <div style={{
      margin: '6px 16px 0',
      background: '#fff',
      borderRadius: 24,
      padding: '24px 20px 20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px -18px rgba(0,0,0,.25)',
    }}>
      {/* top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${pri}, ${acc})` }} />

      {/* glow */}
      <div style={{
        position: 'absolute', left: '50%', top: 24,
        width: 160, height: 160, transform: 'translateX(-50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${acc}cc, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: sg }}>
        {/* logo circle */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: '#fff', boxShadow: '0 6px 20px -6px rgba(0,0,0,.22)',
          display: 'grid', placeItems: 'center',
          overflow: 'hidden', border: '1px solid #f0ece7',
          position: 'relative', flexShrink: 0,
        }}>
          {logo ? (
            <Image src={logo} alt={name} fill style={{ objectFit: 'contain', padding: 8 }} />
          ) : (
            <span style={{ fontWeight: 700, fontSize: 36, color: pri }}>{name[0]?.toUpperCase()}</span>
          )}
        </div>

        <h1 style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-.02em', color: sec, margin: '16px 0 0', fontFamily: sg }}>
          {name}
        </h1>

        {subtitle && (
          <p style={{ fontFamily: sg, fontSize: 14, lineHeight: 1.5, color: '#7a7269', margin: '8px 0 0', maxWidth: 280 }}>
            {subtitle}
          </p>
        )}

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 14, fontFamily: sm, fontSize: 11, fontWeight: 700,
          color: pri, background: acc, borderRadius: 999, padding: '6px 14px',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: pri, display: 'inline-block' }} />
          ABIERTO · 20 min
        </div>
      </div>
    </div>
  );
}
