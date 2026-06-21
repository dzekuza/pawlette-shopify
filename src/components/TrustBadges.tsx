'use client';

import Image from 'next/image';

export function TrustBadges({ isDark }: { isDark: boolean }) {
  const textClass = isDark ? 'text-cream/45' : 'text-bark-muted';

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
    <div className="grid grid-cols-4 gap-3 w-full pt-4 pb-1 shrink-0">
      {badges.map(b => (
        <div key={b.label} className="flex flex-col items-center justify-start gap-1.5">
          <Image src={encodeURI(b.iconSrc)} alt="" aria-hidden="true" width={64} height={64} style={{ objectFit: 'contain' }} />
          <span className={`text-[11px] font-medium text-center leading-[1.25] ${textClass}`}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
