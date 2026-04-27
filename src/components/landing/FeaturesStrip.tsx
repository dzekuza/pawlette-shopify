'use client';

const FEATURES = [
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_green_drop_shape_with_a_subtle_curve_on_qVGIeFtL Background Removed.png',
    text: 'Waterproof'
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_simple_circular_graphic_depicts_a_clock_face_8DikilGN Background Removed.png',
    text: 'Easy to use'
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/In_a_flat_design_style_a_light_green_heart_shape_mhu_5XWt Background Removed.png',
    text: 'Eco-friendly'
  },
  {
    iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_blue_icon_depicts_a_simple_square_box_k_3i4pxx Background Removed.png',
    text: 'Free delivery'
  }
];

export function FeaturesStrip({ variant }: { variant: 'cream' | 'bold' }) {
  return (
    <div className="px-10 py-5">
      <div className="max-w-[1160px] mx-auto flex justify-around gap-5 flex-wrap">
        {FEATURES.map(f => (
          <div key={f.text} className="flex flex-col items-center gap-2.5 text-center">
            <img
              src={encodeURI(f.iconSrc)}
              alt=""
              aria-hidden="true"
              className="w-16 h-16 object-contain shrink-0"
            />
            <span className={`font-sans text-sm font-medium ${variant === 'bold' ? 'text-cream/60' : 'text-bark-light'}`}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
