'use client';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";
const sm = "var(--font-space-mono, monospace)";

interface MenuPreviewProps {
  pri: string;
  sec: string;
  acc: string;
  bg: string;
  name: string;
}

export function MenuPreview({ pri, sec, acc, bg, name }: MenuPreviewProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: bg, fontFamily: sg, overflowY: 'auto', scrollbarWidth: 'none', position: 'relative' }}>

      {/* top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: `${bg}d0`, backdropFilter: 'blur(8px)' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.08)', display: 'grid', placeItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={sec} strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </div>
        <div style={{ position: 'relative', width: 34, height: 34, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.08)', display: 'grid', placeItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={sec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          <span style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, borderRadius: 999, background: pri, color: '#fff', fontSize: 8, fontWeight: 700, display: 'grid', placeItems: 'center', fontFamily: sg }}>1</span>
        </div>
      </div>

      {/* hero */}
      <div style={{ margin: '4px 12px 0', background: '#fff', borderRadius: 20, padding: '20px 16px 18px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 28px -16px rgba(0,0,0,.22)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${pri}, ${acc})` }} />
        <div style={{ position: 'absolute', left: '50%', top: 20, width: 120, height: 120, transform: 'translateX(-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${acc}bb, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#fff', boxShadow: '0 6px 18px -6px rgba(0,0,0,.2)', display: 'grid', placeItems: 'center', border: '1px solid #f0ece7', fontFamily: sg, fontWeight: 700, fontSize: 24, color: pri }}>
            {name?.[0]?.toUpperCase() ?? 'R'}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-.01em', color: sec, margin: '12px 0 0' }}>{name || 'Tu restaurante'}</div>
          <div style={{ fontSize: 12, color: '#7a7269', margin: '5px 0 0' }}>Granizados · especialidades</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, fontFamily: sm, fontSize: 9, fontWeight: 700, color: pri, background: acc, borderRadius: 999, padding: '5px 12px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: pri }} /> ABIERTO · 20 min
          </div>
        </div>
      </div>

      {/* category chips */}
      <div style={{ display: 'flex', gap: 7, padding: '14px 12px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <span style={{ flexShrink: 0, fontWeight: 600, fontSize: 12, color: '#fff', background: pri, borderRadius: 999, padding: '7px 14px' }}>Granizados</span>
        <span style={{ flexShrink: 0, fontWeight: 600, fontSize: 12, color: sec, background: '#fff', border: '1.5px solid #ece6df', borderRadius: 999, padding: '7px 14px' }}>Combos</span>
        <span style={{ flexShrink: 0, fontWeight: 600, fontSize: 12, color: sec, background: '#fff', border: '1.5px solid #ece6df', borderRadius: 999, padding: '7px 14px' }}>Bebidas</span>
      </div>

      {/* product card */}
      <div style={{ margin: '10px 12px 16px', background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 22px -14px rgba(0,0,0,.28)' }}>
        <div style={{ position: 'relative', height: 130, background: '#f5f0eb', display: 'grid', placeItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#d0c8be" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span style={{ position: 'absolute', top: 10, left: 10, fontWeight: 600, fontSize: 11, color: '#fff', background: pri, borderRadius: 999, padding: '4px 10px', boxShadow: '0 3px 8px rgba(0,0,0,.18)' }}>Granizados</span>
          <span style={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, fontSize: 12, color: pri, background: '#fff', borderRadius: 999, padding: '4px 10px', boxShadow: '0 3px 8px rgba(0,0,0,.12)' }}>$27.000</span>
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: sm, fontSize: 9, fontWeight: 700, color: pri, background: acc, borderRadius: 999, padding: '4px 8px', marginBottom: 8 }}>★ EDICIÓN ESPECIAL</span>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-.01em', color: sec, marginBottom: 4 }}>Combo Mundialista</div>
          <div style={{ fontSize: 12, color: '#8a8177', marginBottom: 12, lineHeight: 1.4 }}>Granizado de mango + topping de la casa.</div>
          <div style={{ background: pri, color: '#fff', borderRadius: 11, padding: '10px 0', textAlign: 'center', fontWeight: 700, fontSize: 13, boxShadow: `0 8px 16px -8px ${pri}` }}>
            + Añadir al pedido
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ margin: '0 10px 10px', background: sec, borderRadius: 13, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 24px -10px rgba(0,0,0,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ minWidth: 22, height: 22, padding: '0 6px', borderRadius: 7, background: pri, color: '#fff', fontWeight: 700, fontSize: 11, display: 'grid', placeItems: 'center' }}>1</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>Completar pedido</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>$27.000</span>
      </div>
    </div>
  );
}
