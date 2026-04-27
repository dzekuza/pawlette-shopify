"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  className?: string;
}

const ActionButton = ({ children }: { children: React.ReactNode }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    style={{
      marginTop: 32,
      padding: '14px 36px',
      borderRadius: 100,
      background: '#3D3530',
      color: '#FAF7F2',
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: '0.02em',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(61,53,48,0.18)',
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {children}
  </motion.button>
);

const FADE_IN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  className,
}) => {
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-start text-center px-4 pt-20",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center" style={{ padding: '0 24px', maxWidth: 720 }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          style={{
            marginBottom: 20,
            display: 'inline-block',
            borderRadius: 100,
            border: '1px solid #E8E3DC',
            background: 'rgba(243,237,230,0.7)',
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: '#9B948F',
            backdropFilter: 'blur(8px)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#3D3530',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
          }}
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_IN_ANIMATION_VARIANTS} style={{ display: 'inline-block' }}>
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.45 }}
          style={{
            marginTop: 20,
            maxWidth: 480,
            fontSize: 17,
            lineHeight: 1.6,
            color: '#9B948F',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
          }}
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.55 }}
        >
          <ActionButton>{ctaText}</ActionButton>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex gap-4"
          animate={{
            x: ["-100%", "0%"],
            transition: { ease: "linear", duration: 40, repeat: Infinity },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 md:h-64 flex-shrink-0"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              <img
                src={src}
                alt={`Showcase image ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-md"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
