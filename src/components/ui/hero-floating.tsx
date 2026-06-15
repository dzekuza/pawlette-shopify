"use client";

import Link from "next/link";
import { useWindowWidth } from "@/hooks/useWindowWidth";

const HERO_IMAGES = {
  left: "/A_woman_and_her_golden_retriever_sit_together_on_jKVk75j-.webp",
  right: "/A_sage_green_pet_collar_displays_the_name_HARRY_2CvCRWm.webp",
};

interface FloatingHeroProps {
  className?: string;
}

export function FloatingHero({ className }: FloatingHeroProps) {
  const w = useWindowWidth() ?? 1200;
  const isMobile = w < 768;

  return (
    <section
      className={className}
      style={{
        background: "var(--color-cream)",
        padding: isMobile ? "32px 16px 48px" : "32px 24px 64px",
        maxWidth: 1292,
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Text + Trusted by row */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: 32,
      }}>
        {/* Left text block */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: isMobile ? "100%" : 960,
          flex: "1 1 auto",
        }}>
          <h1 style={{
            fontSize: isMobile ? "clamp(40px, 9vw, 56px)" : 72,
            letterSpacing: "-0.02em",
            lineHeight: "120%",
          }}>
            Antkakliai skirti jims ir jų seinininkams
          </h1>

          <p style={{
            fontSize: 20,
            fontWeight: 500,
            lineHeight: "150%",
            color: "var(--color-bark-muted)",
            margin: 0,
            maxWidth: 560,
          }}>
            Kiekvienas pakabukas prisisega per kelias sekundes ir taip pat lengvai nusiima. Rink, derink ir keisk pagal nuotaiką, sezoną ar progą.
          </p>

          <div style={{ display: "flex", gap: isMobile ? 12 : 24, alignItems: "center" }}>
            <Link
              href="/configure"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--color-sage)",
                borderRadius: 100,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--color-interactive-text)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Kurk savo antkaklį →
            </Link>
            <Link
              href="/products/charm-charms"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,253,249,0.88)",
                border: "1.5px solid rgba(168,213,162,0.42)",
                borderRadius: 100,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--color-interactive-text)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Pirkti pakabukus
            </Link>
          </div>
        </div>

        {/* Right: Trusted by */}
        {!isMobile && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
            alignSelf: "flex-end",
            paddingBottom: 8,
          }}>
            <span style={{ fontSize: 16, color: "var(--color-bark-muted)", lineHeight: 1.7 }}>
              Mums pasitiki
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#CDCDCD",
                    boxShadow: "0 0 4px rgba(0,0,0,0.25)",
                    flexShrink: 0,
                    marginLeft: i > 0 ? -28 : 0,
                    overflow: "clip",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two images below */}
      <div style={{
        display: "flex",
        gap: 16,
        height: isMobile ? "auto" : 400,
        flexDirection: isMobile ? "column" : "row",
      }}>
        {/* Left big image */}
        <div style={{
          ...(isMobile
            ? { width: "100%", aspectRatio: "3/4", maxHeight: 300 }
            : { flex: "1 1 0", minWidth: 0, alignSelf: "stretch" }),
          borderRadius: 24,
          overflow: "clip",
          background: "#DDD",
          position: "relative",
        }}>
          <img
            src={HERO_IMAGES.left}
            alt="Auksaspalvė retriverė su PawCharms antkakleliu"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Right smaller image with product card */}
        <div style={{
          flexShrink: 0,
          width: isMobile ? "100%" : 396,
          aspectRatio: isMobile ? "16/9" : undefined,
          borderRadius: 24,
          overflow: "clip",
          background: "#DDD",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: isMobile ? 16 : 24,
          gap: 10,
        }}>
            <img
              src={HERO_IMAGES.right}
              alt="Žalias PawCharms antkaklis su vardu"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Floating product card */}
            <div style={{
              position: "relative",
              background: "#FAFAFA",
              borderRadius: 12,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  background: "#DDD",
                  overflow: "clip",
                  flexShrink: 0,
                }}>
                  <img
                    src={HERO_IMAGES.right}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--color-bark-light)", lineHeight: 1.1 }}>
                    Paprasta naudoti
                  </span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-bark-light)" }}>Kaina:</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-bark-light)" }}>€12</span>
                  </div>
                </div>
              </div>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2D2D2D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
