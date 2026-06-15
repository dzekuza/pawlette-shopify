'use client';

import Image from 'next/image';
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

export function FeaturesStrip() {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section style={{ background: 'var(--color-cream)' }}>
      <div style={{
        maxWidth: 1200,
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
              background: 'var(--color-surface-2)',
              borderRadius: 20,
              padding: isMobile ? '20px 16px' : '24px 20px',
            }}
          >
            <Image
              src={encodeURI(f.iconSrc)}
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              style={{ objectFit: 'contain', flexShrink: 0 }}
            />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--color-bark-light)',
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
