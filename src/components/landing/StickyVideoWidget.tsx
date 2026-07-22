'use client';

import { useRef, useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

const VIDEO_SRC = 'https://cdn.shopify.com/videos/c/o/v/a32c10206bf546289fe5d8bcb6cef346.mp4';

export function StickyVideoWidget({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const video = videoRef.current;
    const next = !expanded;
    setExpanded(next);
    if (!video) return;
    video.muted = !next;
    video.play().catch(() => {});
  };

  const collapse = () => {
    const video = videoRef.current;
    setExpanded(false);
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: `calc(${16 + bottomOffset}px + var(--cookie-banner-height, 0px))`,
        zIndex: 400,
        width: expanded ? 240 : 108,
        height: expanded ? 426 : 144,
        transition: 'width 320ms cubic-bezier(0.23, 1, 0.32, 1), height 320ms cubic-bezier(0.23, 1, 0.32, 1), bottom 200ms ease-out',
      }}
    >
      {!expanded && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: -6,
            zIndex: 1,
            background: 'var(--color-sage)',
            color: 'var(--color-interactive-text)',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            padding: '8px 13px',
            borderRadius: '14px 14px 14px 4px',
            boxShadow: '0 4px 12px rgba(61,53,48,0.22)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Kaip tai veikia
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: expanded ? 22 : 22,
          overflow: 'hidden',
          boxShadow: expanded
            ? '0 20px 48px rgba(61,53,48,0.32)'
            : '0 8px 24px rgba(61,53,48,0.22)',
          border: '2px solid var(--color-cream)',
          cursor: expanded ? 'default' : 'pointer',
          transition: 'border-radius 320ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 280ms ease-out',
          background: 'var(--color-bark)',
        }}
        onClick={!expanded ? toggle : undefined}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {!expanded && (
          <div
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(61,53,48,0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VolumeX aria-hidden size={14} color="var(--color-cream)" strokeWidth={2.2} />
          </div>
        )}

        {expanded && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); collapse(); }}
              aria-label="Uždaryti vaizdo įrašą"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(61,53,48,0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X aria-hidden size={15} color="var(--color-cream)" strokeWidth={2.2} />
            </button>
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(61,53,48,0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Volume2 aria-hidden size={15} color="var(--color-cream)" strokeWidth={2.2} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
