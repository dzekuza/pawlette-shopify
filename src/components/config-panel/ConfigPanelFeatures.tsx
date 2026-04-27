import { TrustBadges } from '@/components/TrustBadges'

const MOBILE_FEATURES = [
  { iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_green_drop_shape_with_a_subtle_curve_on_qVGIeFtL Background Removed.png', text: 'Water-proof' },
  { iconSrc: '/Dog_Collar_Flat_Lay (3)/A_simple_circular_graphic_depicts_a_clock_face_8DikilGN Background Removed.png', text: 'Easy to use' },
  { iconSrc: '/Dog_Collar_Flat_Lay (3)/In_a_flat_design_style_a_light_green_heart_shape_mhu_5XWt Background Removed.png', text: 'Eco-friendly' },
  { iconSrc: '/Dog_Collar_Flat_Lay (3)/A_light_blue_icon_depicts_a_simple_square_box_k_3i4pxx Background Removed.png', text: 'Free returns' }
]

interface ConfigPanelFeaturesProps {
  isDark: boolean
  isMobile: boolean
}

export function ConfigPanelFeatures ({
  isDark,
  isMobile
}: ConfigPanelFeaturesProps) {
  if (!isMobile) {
    return <TrustBadges isDark={isDark} />
  }

  return (
    <div style={{ display: 'flex', gap: 4, paddingTop: 16 }}>
      {MOBILE_FEATURES.map((feature) => (
        <div
          key={feature.text}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          <img
            src={encodeURI(feature.iconSrc)}
            alt=''
            aria-hidden='true'
            style={{ width: 64, height: 64, objectFit: 'contain' }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#6B6460',
              textAlign: 'center',
              fontFamily: "'DM Sans',sans-serif",
              lineHeight: 1.3
            }}
          >
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  )
}
