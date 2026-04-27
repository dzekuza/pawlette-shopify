'use client';

export function TrustBadges({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? 'rgba(250,247,242,0.45)' : '#9B948F';

  const badges = [
    {
      iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_green_drop_shape_with_a_subtle_curve_on_qVGIeFtL Background Removed.png',
      label: '30-day returns'
    },
    {
      iconSrc: '/Dog_Collar_Flat_Lay (3)/A_simple_circular_graphic_depicts_a_clock_face_8DikilGN Background Removed.png',
      label: 'Secure checkout'
    },
    {
      iconSrc: '/Dog_Collar_Flat_Lay (3)/In_a_flat_design_style_a_light_green_heart_shape_mhu_5XWt Background Removed.png',
      label: 'Free over €40'
    },
    {
      iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_blue_icon_depicts_a_simple_square_box_k_3i4pxx Background Removed.png',
      label: 'Made in LT'
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 12,
        width: '100%',
        padding: '16px 0 4px',
        flexShrink: 0,
      }}
    >
      {badges.map(b => (
        <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 6 }}>
          <img src={encodeURI(b.iconSrc)} alt="" aria-hidden="true" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: textColor, textAlign: 'center', lineHeight: 1.25 }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
