
import React from 'react';
import { Button } from './ui/Button';
import { HERO_CONTENT, HERO_MAP_URL } from '../constants/core';

const Hero: React.FC = () => {
  const openMaps = () => {
    window.open(HERO_MAP_URL, '_blank', 'noopener,noreferrer');
  };

  const goToMenu = () => {
    window.location.assign('/carta');
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-coffee">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/nuestra_historia/pan-recien-horneado-santa-pola.webp"
          alt="Hogazas de pan artesano recién horneadas y mesa de trabajo en Amalis Cafetería"
          className="w-full h-full object-cover [filter:brightness(0.58)]"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl pt-24 md:pt-0">
        <h1
          className="font-serif text-cream mb-8 leading-tight tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold [text-wrap:balance] [paint-order:stroke_fill] [-webkit-text-stroke:0.6px_rgba(245,239,231,0.18)] [text-shadow:0_3px_14px_rgba(0,0,0,0.38)]"
        >
          {HERO_CONTENT.title}
          <span className="block mt-2 text-caramel italic [text-shadow:0_2px_10px_rgba(0,0,0,0.28)]">
            {HERO_CONTENT.highlight}
          </span>
        </h1>
        <div className="flex flex-col gap-3 mb-10 max-w-xl mx-auto">
          <p className="text-base md:text-xl text-cream/95 font-sans font-medium leading-relaxed">
            {HERO_CONTENT.subtitle}
          </p>
          <p className="text-xs md:text-sm text-cream/60 font-sans font-medium tracking-[0.2em] uppercase">
            {HERO_CONTENT.microcopy}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="honey" size="lg" onClick={goToMenu}>
            {HERO_CONTENT.ctaPrimary}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="bg-black/35 border-white/60 text-white shadow-[0_10px_26px_rgba(0,0,0,0.35)] hover:bg-black/50"
            onClick={openMaps}
          >
            {HERO_CONTENT.ctaSecondary}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
