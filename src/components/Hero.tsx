
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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
          <h1 className="font-serif text-cream mb-6 leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
            El Corazón de<br />Santa Pola,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel to-orange-300 italic">
              Sin Atajos.
            </span>
          </h1>
        </Reveal>
        <Reveal width="100%" delay={0.4}>
          <div className="flex flex-col gap-2 mb-10 max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl text-cream font-sans font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Aquí huele a pan recién hecho desde bien temprano.
            </p>
            <p className="text-xl md:text-2xl text-cream/90 font-sans font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] italic">
              "La verdadera artesanía no tiene modo rápido."
            </p>
          </div>
        </Reveal>
        <Reveal width="100%" delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="honey" size="lg" onClick={() => navigate('/carta')}>
              Explorar Menú
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="bg-black/35 border-white/60 text-white shadow-[0_10px_26px_rgba(0,0,0,0.35)] hover:bg-black/50"
              onClick={() => scrollToSection('about')}
            >
              Nuestra Historia
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Hero;
