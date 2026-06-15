'use client';

import { useWindowWidth } from '@/hooks/useWindowWidth';

const FEATURES = [
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_green_drop_shape_with_a_subtle_curve_on_qVGIeFtL Background Removed.png',
    text: 'Atsparūs vandeniui',
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_simple_circular_graphic_depicts_a_clock_face_8DikilGN Background Removed.png',
    text: 'Paprasta naudoti',
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/In_a_flat_design_style_a_light_green_heart_shape_mhu_5XWt Background Removed.png',
    text: 'Draugiška kasdienai',
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_blue_icon_depicts_a_simple_square_box_k_3i4pxx Background Removed.png',
    text: 'Nemokamas pristatymas',
  },
];

export function FeaturesStrip({ variant }: { variant: 'cream' | 'bold' }) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section style={{ background: 'var(--color-cream)' }}>
      <div style={{
        maxWidth: 1292,
        margin: '0 auto',
        padding: isMobile ? '0 16px 48px' : '0 64px 64px',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 12 : 20,
      }}>
        {FEATURES.map(f => (
          <div
            key={f.text}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
              background: '#F0EDE7',
              borderRadius: 20,
              padding: isMobile ? '20px 16px' : '24px 20px',
            }}
          >
            <img
              src={encodeURI(f.iconSrc)}
              alt=""
              aria-hidden="true"
              style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0 }}
            />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: variant === 'bold' ? 'rgba(250,247,242,0.6)' : 'var(--color-bark-light)',
              lineHeight: 1.4,
            }}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
