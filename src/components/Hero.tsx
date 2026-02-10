
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';
import { HERO_CONTENT, LOCATION_INFO } from '../constants';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openMaps = () => {
    window.open(LOCATION_INFO.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-coffee">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/sections/editada-01.webp"
          alt="Pan artesanal de masa madre recién horneado en Amalis Cafetería, mostrando su corteza dorada y crujiente"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl pt-24 md:pt-0">
        <Reveal width="100%">
          <h1 className="font-serif text-cream mb-8 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
            {HERO_CONTENT.title}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-caramel to-orange-300 italic">
              {HERO_CONTENT.highlight}
            </span>
          </h1>
        </Reveal>
        <Reveal width="100%" delay={0.4}>
          <div className="flex flex-col gap-4 mb-12 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-cream/95 font-sans font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {HERO_CONTENT.subtitle}
            </p>
            <p className="text-xs md:text-sm text-cream/60 font-sans font-medium tracking-[0.2em] uppercase">
              {HERO_CONTENT.microcopy}
            </p>
          </div>
        </Reveal>
        <Reveal width="100%" delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="honey" size="lg" onClick={() => navigate('/carta')}>
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
        </Reveal>
      </div>
    </div>
  );
};

export default Hero;
